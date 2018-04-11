import { Injectable } from '@angular/core';
import { ICommunity, ICommunityData, IProfile, IMessage, ISkills } from './community-interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommunityService {
    private _navSmall = new Subject<boolean>();
    private _communityID = new BehaviorSubject('');

    private _currentMessages = new Subject<IMessage[]>();
    private _currentMembers = new BehaviorSubject<IProfile[]>([]);
    private _currentSkills = new BehaviorSubject<ISkills[]>([]);
    constructor() { }
    // TODO: use community links
    getCommunities(uid: string) {
        return communities;
    }

    makeSmall(isSmall: boolean) {
        this._navSmall.next(isSmall);
    }
    isSmall(): Observable<boolean> {
        return this._navSmall.asObservable();
    }

    getCommunityData(communityID?: string) {
        const currentID = communityID ? communityID : this._communityID.getValue();
        const parsed = parseInt(currentID, 10);
        if (isNaN(parsed))
            return detailCommunities[Communities[currentID]];
        return detailCommunities[parsed];
    }
    get communityID(): BehaviorSubject<string> {
        return this._communityID;
    }
    set currentCommunity(id: string) {
        this._communityID.next(id);
        this._currentMembers.next(detailCommunities[Communities[id]].members);
        this._currentMessages.next(detailCommunities[Communities[id]].messages);
    }
    get currentCommunity(): string {
        return this._communityID.getValue();
    }

    get currentMembers(): BehaviorSubject<IProfile[]> {
        return this._currentMembers;
    }
    get currentMessages(): Observable<IMessage[]> {
        return this._currentMessages;
    }

    get currentSkills(): BehaviorSubject<ISkills[]> {
        return this._currentSkills;
    }
    get skills(): ISkills[] {
        return this._currentSkills.getValue();
    }
    set skills(currentSkills: ISkills[]) {
        this._currentSkills.next(currentSkills);
    }
}
// Names
const baxter: IProfile = {
    name: 'Baxter Cochennet',
    about: 'Simple about',
    skills: ['Accounting', 'Personal Finance', 'Budgeting', 'Photography'],
    passions: ['Cycling', 'Fly Fishing', 'Photography', 'SUP', 'Cliff Jumping', 'Community'],
    location: 'Denver',
    connections: 15,
    imgUrl: '/assets/img/photos/baxter.jpg'
};
const me: IProfile = {
    name: 'Andrei Parrent',
    about: `After the inception of Sourcerer, I have been working on an ever growing list of code technique to further
     my coding passion.I am constantly looking for new opportunities to expand my knowledge of technologies
     and produce works I am proud of.`,
    skills: ['Code', 'Web Design', 'whatever'],
    passions: ['some', 'passions'],
    location: 'Denver',
    connections: 9,
    imgUrl: '/assets/img/photos/andrei.jpg'
};
// Test Communities
const testData: ICommunityData = {
    name: 'Test Community',
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