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
        this._startAt.next(search);
        this._endAt.next(search + '\uf8ff');
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
}
export interface ISearch<T> {
    community: boolean;
    data: T;
}
const testCommunities: ICommunity[] = [
    {
        name: 'Test Community',
        desc: 'a short description about the community and such',
        img: {
            webp: '../../../assets/img/photos/eclipse.webp',
            jpf: '../../../assets/img/photos/eclipse.jpf',
            else: '../../../assets/img/photos/eclipse.jpg'
        },
        location: 'Denver',
        nav: {
            lat: 39.7392,
            lng: -104.9903
        },
        members: 8,
        link: 'testlink'
    },
    {
        name: 'Univeristy of Denver',
        desc: 'The official communtiy of the University of Denver.',
        img: {
            webp: '../../../assets/img/photos/eclipse.webp',
            jpf: '../../../assets/img/photos/eclipse.jpf',
            else: '../../../assets/img/photos/eclipse.jpg'
        },
        location: 'Denver',
        nav: {
            lat: 39.682380,
            lng: -104.964384
        },
        members: 8,
        link: 'testlink'
    },
    {
        name: 'Local PD Community',
        desc: 'The community for the Denver Police Department',
        img: {
            webp: '../../../assets/img/photos/fish.webp',
            jpf: '../../../assets/img/photos/fish.jpf',
            else: '../../../assets/img/photos/fish.jpg'
        },
        location: 'Denver',
        nav: {
            lat: 39.687380,
            lng: -104.959384
        },
        members: 8,
        link: 'testlink'
    },
    {
        name: 'Neighborhood Community',
        desc: 'Just a small nieghborhood community',
        img: {
            webp: '../../../assets/img/photos/fish.webp',
            jpf: '../../../assets/img/photos/fish.jpf',
            else: '../../../assets/img/photos/fish.jpg'
        },
        location: 'Denver',
        nav: {
            lat: 39.684380,
            lng: -104.969384
        },
        members: 8,
        link: 'testlink'
    },
    {
        name: 'One Observatory Park',
        desc: 'The best appartments for DU students',
        img: {
            webp: '../../../assets/img/photos/fish.webp',
            jpf: '../../../assets/img/photos/fish.jpf',
            else: '../../../assets/img/photos/fish.jpg'
        },
        location: 'Denver',
        nav: {
            lat: 39.678210,
            lng: -104.958884
        },
        members: 8,
        link: 'testlink'
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