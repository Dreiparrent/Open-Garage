import { Injectable } from '@angular/core';
import { ICommunity, ICommunityData, IProfile, IMessage } from './community-interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommunityService {
    private _navSmall = new Subject<boolean>();
    private _communityID = new BehaviorSubject('');
    private _currentMessages = new Subject<IMessage[]>();
    private _currentMembers = new BehaviorSubject<IProfile[]>([]);
    constructor() { }
    // TODO: use community links
    getCommunities(uid: string) {
        return communities;
    }
    getCommunityData(communityID?: string) {
        const currentID = communityID ? communityID : this._communityID.getValue();
        const parsed = parseInt(currentID, 10);
        if (isNaN(parsed))
            return detailCommunities[Communities[currentID]];
        return detailCommunities[parsed];
    }
    makeSmall(isSmall: boolean) {
        this._navSmall.next(isSmall);
    }
    isSmall(): Observable<boolean> {
        return this._navSmall.asObservable();
    }
    get currnetCommunity(): BehaviorSubject<string> {
        return this._communityID;
    }
    set currentCommunity(communityID: string) {
        this._communityID.next(communityID);
        this._currentMembers.next(detailCommunities[Communities[communityID]].members);
        this._currentMessages.next(detailCommunities[Communities[communityID]].messages);
    }
    get members(): BehaviorSubject<IProfile[]> {
        return this._currentMembers;
    }
    get messages(): Observable<IMessage[]> {
        return this._currentMessages;
    }
}
// Names
const baxter: IProfile = {
    name: 'Baxter Cochennet',
    about: 'Simple about',
    location: 'Denver',
    connections: 15,
    imgUrl: '/assets/img/photos/baxter.jpg'
};
const me: IProfile = {
    name: 'Andrei Parrent',
    about: 'Simple about',
    location: 'Denver',
    connections: 9,
    imgUrl: '/assets/img/photos/andrei.jpg'
};
// Test Communities
const testData: ICommunityData = {
    name: 'Test Community',
    skills: 'no skills',
    members: [baxter, me, baxter, me, baxter, me, baxter, me],
    messages: [],
    link: 'test'
};
const test: ICommunity = {
    name: testData.name,
    desc: '',
    link: testData.link
};
/*
const test2Data: ICommunityData = {
    name: 'Test Community',
    skills: 'no skills',
    members: [baxter, me],
    messages: '',
    link: 'test'
};
const test2: ICommunity = {
    name: testData.name,
    desc: '',
    link: testData.link
};

const test3Data: ICommunityData = {
    name: 'Test Community',
    skills: 'no skills',
    members: [baxter, me],
    messages: '',
    link: 'test'
};
const test3: ICommunity = {
    name: testData.name,
    desc: '',
    link: testData.link
};
*/
// Helpers
enum Communities { test }
const communities: ICommunity[] = [ test ];
const detailCommunities: ICommunityData[] = [ testData ];