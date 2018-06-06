import { Injectable } from '@angular/core';
import { ICommunity, IProfile, ICommunityData, IUser } from './community-interfaces';
import { INavigation } from './community-interfaces';
import { BehaviorSubject } from 'rxjs';
import { firestore } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { CommunityService } from './community.service';

@Injectable()
export class CommunitiesService {

    private _locCollection: AngularFirestoreCollection;
    private _locationChange = 0.2;
    private _searchResults = new BehaviorSubject<ISearch<ICommunity | IUser>[]>([]);
    private _isSearch = false;
    get searchResults() {
        return this._searchResults.getValue();
    }
    set searchResults(search) {
        this._searchResults.next(search);
    }
    private _searchCommunities: ICommunity[] = [];
    get searchCommunities() {
        return this._searchCommunities;
    }
    set searchCommunities(coms: ICommunity[]) {
        this._searchCommunities = coms;
        coms.forEach(com => this.searchResults.push({ community: true, data: com }));
        console.log('set');
    }
    private _searchUsers: IUser[] = [];
    get searchUsers() {
        return this._searchUsers;
    }
    set searchUsers(users: IUser[]) {
        this._searchUsers = users;
        users.forEach(user => this.searchResults.push({ community: false, data: user }));
    }

    constructor(private db: AngularFirestore, private comService: CommunityService) {
        this._locCollection = db.collection('location');
    }
    locationSearch(pos: firestore.GeoPoint, locationAdd = 1): void { // void for now? make error?
        if (!this._isSearch) {
            if (locationAdd < 2)
            this.clearSearch();
            const change = this._locationChange + locationAdd * this._locationChange; // 0.2 TODO: add nothing found
            const greaterPoint: firestore.GeoPoint = new firestore.GeoPoint(pos.latitude + change, pos.longitude + change);
            const lesserPoint: firestore.GeoPoint = new firestore.GeoPoint(pos.latitude - change, pos.longitude - change);
            this._locCollection.ref.where('nav', '<', greaterPoint).where('nav', '>', lesserPoint).get().then(snap => {
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
            });
        }
    }

    search(search: string) {
        this._isSearch = true;
        this.clearSearch();
        this._searchResults.next([]);
        this.searchUsers = [];
        this.searchCommunities = [];
        this.db.collection('community').ref.where('name', '>=', search).get().then(comSnap => {
            if (comSnap.empty)
                return [];
            else
                return comSnap.docs;
        }).then(coms => {
            coms.forEach(com => {
                this.comService.getCommunity(com.id, true).then(comData => {
                    this.searchCommunities.push(comData);
                    this.searchResults.push({ community: true, data: comData });
                    console.log(this.searchCommunities);
                    console.log(this.searchResults);
                });
            });
        }).then(() => {
            this.db.collection('users').ref.where('name', '>=', search).get().then(userSnap => {
                if (userSnap.empty)
                    return [];
                else
                    return userSnap.docs;
            }).then(users => {
                console.log(users);
                users.forEach(user => {
                    const ref: DocumentReference = user.data()['ref'];
                    this.comService.getMember(user.id).then(userData => {
                        this.searchUsers.push(userData);
                        this.searchResults.push({ community: false, data: userData });
                    });
                });
            });
        });
        // this.clearSearch
    }

    getSearch() {
        return this._searchResults.asObservable();
    }
    clearSearch() {
        this._searchCommunities = [];
        this._searchUsers = [];
        this._searchResults.next([]);
    }
    /*
    locationSearch(hype: number): Promise<ICommunity[]> {
        const prom = new Promise<ICommunity[]>((resolve, reject) => {
            setTimeout(() => {
                if (hype > 9)
                    resolve(testCommunities);
                else
                    reject('Navigation (lng + lat) hypotenuse is less than 10');
            }, 200);
        });
        return prom;
    }
    */
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