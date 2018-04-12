import { Injectable } from '@angular/core';
import { ICommunity, ICommunityData, IProfile, IMessage, ISkills } from './community-interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommunityService {
    private _navSmall = new Subject<boolean>();
    private _communityID = new BehaviorSubject('');

    private _communityData = new BehaviorSubject<ICommunityData>(blankData);
    private _communityName = new BehaviorSubject('');
    private _skills = new BehaviorSubject<ISkills[]>([]);
    private _showWeb = new Subject<boolean>();
    private _members = new BehaviorSubject<IProfile[]>([]);
    private _messages = new Subject<IMessage[]>();

    constructor() { }
    getCommunities(uid: string) {
        return communities;
    }

    init(id: string): BehaviorSubject<string> {
        this.communityID = id;
        return this._communityName;
    }
    set communityID(id: string) {
        this._communityID.next(id);
        this.community = this.getCommunityData(id);
    }
    get communityID(): string {
        return this._communityID.getValue();
    }

    set community(community: ICommunityData) {
        this._communityData.next(community);
        this._communityName.next(community.name);
        this._members.next(community.members);
        this._messages.next(community.messages);
    }
    get community(): ICommunityData {
        return this._communityData.getValue();
    }


    // Community variables
    get name(): string {
        return this._communityName.getValue();
    }
    get members(): BehaviorSubject<IProfile[]> {
        return this._members;
    }
    get messages(): Observable<IMessage[]> {
        return this._messages;
    }
    listenShowWeb(): Observable<boolean> {
        return this._showWeb.asObservable();
    }
    set showWeb(show: boolean) {
        this._showWeb.next(show);
    }
    set skills(skills: ISkills[]) {
        this._skills.next(skills);
    }
    get skills(): ISkills[] {
        return this._skills.getValue();
    }

    // Firebase
    getCommunity(id?: string): boolean {
        // TODO: Replace this with link finder
        return !!detailCommunities[Communities[id]];
    }
    getCommunityData(id?: string) {
        const currentID = id ? id : this._communityID.getValue();
        const parsed = parseInt(currentID, 10);
        if (isNaN(parsed))
            return detailCommunities[Communities[currentID]];
        return detailCommunities[parsed];
    }

    // Helpers
    makeSmall(isSmall: boolean) {
        this._navSmall.next(isSmall);
    }
    isSmall(): Observable<boolean> {
        return this._navSmall.asObservable();
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
const blankData: ICommunityData = {
    name: '',
    members: [],
    messages: [],
    link: ''
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