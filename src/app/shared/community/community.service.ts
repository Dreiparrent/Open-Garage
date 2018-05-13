import { Injectable } from '@angular/core';
import { ICommunity, ICommunityData, IProfile, IMessage, ICommunitySkills, CommunitySearchType } from './community-interfaces';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable()
export class CommunityService {
    private _navSmall = new Subject<boolean>();
    private _communityID = new BehaviorSubject('');

    private _communityData = new BehaviorSubject<ICommunityData>(blankData);
    private _communityName = new BehaviorSubject('');
    private _skills = new BehaviorSubject<ICommunitySkills[]>([]);
    private _showWeb = new Subject<boolean>();
    private _members = new BehaviorSubject<IProfile[]>([]);
    private _messages = new Subject<IMessage[]>();

    private _searchValue = new BehaviorSubject<string>('');
    private _searchType = new BehaviorSubject<number>(-1);
    private _searchMembers = new BehaviorSubject<string[]>([]);
    private _searchSkills = new BehaviorSubject<string[]>([]);

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
        // origional
        return this._members;
        // extra
        /*
        const tmpMembers: IProfile[] = [];
        this._members.getValue().forEach(member => {
            tmpMembers.push(member);
            tmpMembers.push(member);
            tmpMembers.push(member);
        });
        const tmpSubjects = new BehaviorSubject<IProfile[]>(tmpMembers);
        return tmpSubjects;
        */
    }
    /*
    getMembers(batch: string, lastKey?: string) {
    }
    */
    getMembers(batch: number, lastKey = 0) {
        const startNumber = batch - lastKey;
        return this._members.getValue().slice(startNumber, batch);
    }
    get messages(): Observable<IMessage[]> {
        return this._messages;
    }
    set showWeb(show: boolean) {
        this._showWeb.next(show);
    }
    set skills(skills: ICommunitySkills[]) {
        this._skills.next(skills);
        const data = this._communityData.getValue();
        data.skills = skills;
        this._communityData.next(data);
    }
    get skills(): ICommunitySkills[] {
        return this._skills.getValue();
    }

    // Search parameters
    updateSearch(members: string[] = [], skills: string[] = [], searchValue: string = '', type: CommunitySearchType = -1) {
        this._searchMembers.next(members);
        this._searchSkills.next(skills);
        this._searchType.next(type);
        this._searchValue.next(searchValue);
    }
    get searchValue(): BehaviorSubject<string> {
        return this._searchValue;
    }
    get searchType(): BehaviorSubject<CommunitySearchType> {
        return this._searchType;
    }
    get searchMembers(): BehaviorSubject<string[]> {
        return this._searchMembers;
    }
    get searchSkills(): BehaviorSubject<string[]> {
        return this._searchSkills;
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
    hyp: 112.2593,
    members: 8,
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