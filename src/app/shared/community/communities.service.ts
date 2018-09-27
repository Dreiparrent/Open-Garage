import { Injectable } from '@angular/core';
import { ICommunity, IProfile, ICommunityData, IUser } from './community-interfaces';
import { INavigation } from './community-interfaces';
import { BehaviorSubject, Subject, from } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { firestore } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { CommunityService } from './community.service';
import { map, pluck, mergeMap, filter } from 'rxjs/operators';
import { IPin } from '../../pages/communities-pages/communities-page.component';

@Injectable()
export class CommunitiesService {

    private _locCollection: AngularFirestoreCollection;
    private _locationChange = 0.2;
    private _searchResults = new BehaviorSubject<ISearch<ICommunity | IUser>[]>([]);
    private _isSearch = false;
    private _currentLocation: firestore.GeoPoint = null;
    get searchResults() {
        return this._searchResults.getValue();
    }
    set searchResults(search: ISearch<ICommunity | IUser>[]) {
        this._searchResults.next(search);
    }
    private _searchCommunities: ICommunity[] = [];
    private get searchCommunities() {
        return this._searchCommunities;
    }
    private set searchCommunities(coms: ICommunity[]) {
        this._searchCommunities = coms;
        if (coms.length > 0)
            coms.forEach(com => this.searchResults.push({ community: true, data: com}));
        else
            this.searchResults = this.searchResults.filter(res => res.community !== true);
    }
    private _searchUsers: IUser[] = [];
    private get searchUsers() {
        return this._searchUsers;
    }
    private set searchUsers(users: IUser[]) {
        this._searchUsers = users;
        if (users.length > 0)
            users.forEach(user => this.searchResults.push({ community: false, data: user }));
        else
            this.searchResults = this.searchResults.filter(res => res.community === true);
    }
    pins = new BehaviorSubject<IPin[]>([]);

    // Manual search
    private fullSearch = false;
    private _startAt = new Subject<string>();
    private get startAt() {
        return this._startAt.asObservable();
    }
    private _endAt = new Subject<string>();
    private get endAt() {
        return this._endAt.asObservable();
    }

    private addSearch(search: ISearch<ICommunity | IUser>) {
        if (search.community)
            this._searchCommunities.push(search.data as ICommunity);
        else this._searchUsers.push(search.data as IUser);
        this.searchResults.push(search);
    }

    constructor(private db: AngularFirestore, private comService: CommunityService) {
        this._locCollection = db.collection('location');
        combineLatest(this.startAt, this.endAt).subscribe(val => {
            this._search(val);
        });
    }
    locationSearch(pos = this._currentLocation, locationAdd = 1): Promise<ISearch<ICommunity | IUser>[]> { // void for now? make error?
        if (!this._isSearch && pos !== null) {
            this._currentLocation = pos;
            this.clearSearch();
            const change = this._locationChange + locationAdd * this._locationChange; // 0.2 TODO: add nothing found
            const greaterPoint: firestore.GeoPoint = new firestore.GeoPoint(pos.latitude + change, pos.longitude + change);
            const lesserPoint: firestore.GeoPoint = new firestore.GeoPoint(pos.latitude - change, pos.longitude - change);
            return this._locCollection.ref.where('nav', '<', greaterPoint).where('nav', '>', lesserPoint).get().then(snap => {
                if (snap.empty)
                    return [];
                else
                    return snap.docs;
            }).then(docs => {
                docs.forEach(doc => {
                    const locType = doc.data()['type'];
                    if (locType === 0)
                        doc.ref.collection('user').get().then(users => {
                            users.forEach(user => {
                                const ref: DocumentReference = user.data()['ref'];
                                this.comService.getMember(user.id).then(userData => {
                                    this.searchUsers.push(userData);
                                    this.searchResults.push({ community: false, data: userData });
                                });
                            });
                        });
                    else if (locType === 1)
                        doc.ref.collection('community').get().then(coms => {
                            coms.forEach(com => {
                                this.comService.getCommunity(com.id, true).then(comData => {
                                    this.searchCommunities.push(comData);
                                    this.searchResults.push({ community: true, data: comData });
                                    console.log(this.searchCommunities);
                                    console.log(this.searchResults);
                                });
                            });
                        });
                });
            }).then(() => this.searchResults);
        }
    }
    search(search: string, fullSearch = false) {
        console.log(search);
        this.fullSearch = fullSearch;
        this._isSearch = true;
        this._startAt.next(search.toUpperCase());
        this._endAt.next(search.toLowerCase() + '\uf8ff');
        return search;
    }
    private _search(search: [string, string]): Promise<ISearch<ICommunity | IUser>[]> {
        this._isSearch = (search[0].length > 0 && search[1].length > 0) ? true : false;
        this.clearSearch();
        if (this._isSearch)
            return this.db.collection('community').ref
                .orderBy('name').limit(10).startAt(search[0]).endAt(search[1]).get().then(comSnap => {
                    if (comSnap.empty)
                        return [];
                    else return comSnap.docs;
                }).then(comDocs => {
                    comDocs.forEach(doc => {
                        if (!this.searchCommunities.some(sCom => sCom.link === doc.id))
                            this.comService.getCommunity(doc.id, true).then(comData => {
                                if (!this.searchCommunities.some(sCom => sCom.link === comData.link))
                                    this.addSearch({ community: true, data: comData });
                            });
                    });
                }).then(() => {
                    if (this.fullSearch)
                        return this.db.collection('users').ref
                            .orderBy('name').limit(10).startAt(search[0]).endAt(search[1]).get().then(userSnap => {
                                if (userSnap.empty)
                                    return [];
                                else return userSnap.docs;
                            });
                    else return [];
                }).then(userDocs => {
                    userDocs.forEach(doc => {
                        if (!this.searchUsers.some(sUser => sUser.ref.id === doc.id))
                            this.comService.getMember(doc.id).then(user => {
                                if (!this.searchUsers.some(sUser => sUser.ref.id === user.ref.id))
                                    this.addSearch({ community: false, data: user });
                            });
                    });
                }).then(() => this.searchResults);
        else this.locationSearch();
    }

    getSearch() {
        return this._searchResults.asObservable();
    }

    simpleFilter(val: string, useSearch = false) {
        // let tmpOpts =
        // if (useSearch)
    }
    /*
    getAutoComplete(fullSearch = false) {
        this.fullSearch = fullSearch;
        // const testCon = this._searchResults.pipe(map(res => res.map(ress => ress.data.name)));
        /*
            .pipe<string[]>(map(sResult => {
        })).pipe(map(obs => {
            console.log(obs);
            return obs;
        }));
        */
        // return testCon;
        /*
        )).pipe(map(searches => {
            console.log(searches);
            return searches;
            // return searches.map(s => s.data.name);
        }));
        // console.log(testCon);
        // return this._searchResults.asObservable
        *//*
    }
    */
    clearSearch() {
        this.searchCommunities = [];
        this.searchUsers = [];
    }
    pinChange(isOpen: boolean, link: string) {
        // const index = this.pins.map(p => p.com.link).indexOf(link);
        // this.pins[index].expanded = isOpen;
        const tmpPins = this.pins.getValue();
        const index = tmpPins.map(p => p.com.link).indexOf(link);
        if (tmpPins[index].open) {
            tmpPins[index].expanded = true;
            tmpPins[index].open = false;
        } else
            tmpPins[index].expanded = isOpen;
        this.pins.next(tmpPins);
    }
    pinLocation(center: firestore.GeoPoint): Promise<IPin[]> {
        const c0 = new firestore.GeoPoint(center.latitude - 1, center.longitude - 1);
        const c1 = new firestore.GeoPoint(center.latitude + 1, center.longitude + 1);
        console.log(c0, c1);
        return this.db.collection('location').ref
            .where('type', '==', 1).where('nav', '>=', c0).where('nav', '<=', c1).limit(10)
            .orderBy('nav').get().then(snap => {
                const tmpComs: Promise<ICommunity>[] = [];
                for (const doc of snap.docs) {
                    const ref: DocumentReference = doc.data()['ref'] as any;
                    tmpComs.push(this.comService.getCommunity(ref.id, true));
                }
                return Promise.all(tmpComs);
            }).then(coms => {
                const tmpPins = this.pins.getValue();
                const pinArray: IPin[] = [];
                coms.forEach(c => {
                    let op = false;
                    const tindex = tmpPins.map(tp => tp.com.link).indexOf(c.link);
                    if (tindex > -1)
                        op = this.pins.getValue()[tindex].expanded || this.pins.getValue()[tindex].open;
                    pinArray.push({ com: c, expanded: false, open: op });
                });
                this.pins.next(pinArray);
                return pinArray;
            }).catch(error => {
                console.log(error);
                return [];
            });
    }
}
export interface ISearch<T> {
    community: boolean;
    data: T;
}
const testPins = [
    {
        com: <ICommunity>{
            desc: 'test desc',
            img: { else: null },
            link: 'link1',
            location: 'Denver',
            members: null,
            name: 'Test Community',
            nav: { latitude: 39.680, longitude: -104.963 }
        },
        expanded: false,
        open: false
    },
    {
        com: <ICommunity>{
            desc: 'test desc',
            img: { else: null },
            link: 'link2',
            location: 'Denver',
            members: null,
            name: 'Test Community',
            nav: { latitude: 39.681, longitude: -104.964 }
        },
        expanded: false,
        open: false
    },
    {
        com: <ICommunity>{
            desc: 'test desc',
            img: {
                else: null
            },
            link: 'link3',
            location: 'Denver',
            members: null,
            name: 'Test Community',
            nav: { latitude: 39.682, longitude: -104.965 }
        },
        expanded: false,
        open: false
    },
    {
        com: <ICommunity>{
            desc: 'test desc',
            img: { else: null },
            link: 'link4',
            location: 'Denver',
            members: null,
            name: 'Test Community',
            nav: { latitude: 39.683, longitude: -104.966 }
        },
        expanded: false,
        open: false
    }
];
/*
export const SimpleFilter = function (val: string) {
    return this.options.filter(option => option.name.toLowerCase().indexOf(val.toLowerCase()) === 0).slice(0, 5);
}
*/
export const SimpleFilter = function (type = 0, slice = 5) {
    switch (type) {
        case 1:
            return function (val: string): {name: string, type: number} {
                console.log(val, this.options);
                return this.options.filter(option => option.name.toLowerCase().indexOf(val.toLowerCase()) === 0).slice(0, slice);
            };
        case 0:
        default:
            const options = (this._searchResults as BehaviorSubject<any>).getValue();
            return function (val: string) {
                console.log(val, this.options);
                return options.filter(option => option.data.name.toLowerCase().indexOf(val.toLowerCase()) === 0).slice(0, slice);
            };
    }
};