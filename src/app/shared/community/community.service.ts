import { Injectable } from '@angular/core';
import {
    ICommunity, ICommunityData, IProfile, IMessage, ICommunitySkills, CommunitySearchType, Payments,
    IUser,
    IUserData,
    ITags
} from './community-interfaces';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, DocumentSnapshot } from 'angularfire2/firestore';
import { DocumentReference, DocumentData } from '@firebase/firestore-types';

@Injectable()
export class CommunityService {
    private _navSmall = new Subject<boolean>();
    private _communityID = new BehaviorSubject('');

    private _communityCollection: AngularFirestoreCollection;

    private _communityData = new BehaviorSubject<ICommunityData>(blankData);
    private _communityName = new BehaviorSubject('');
    private _skills = new BehaviorSubject<ICommunitySkills[]>([]);
    private _showWeb = new Subject<boolean>();
    private _members = new BehaviorSubject<IUser[]>([]);
    private _messages = new Subject<IMessage[]>();

    private _searchValue = new BehaviorSubject<string>('');
    private _searchType = new BehaviorSubject<number>(-1);
    private _searchMembers = new BehaviorSubject<string[]>([]);
    private _searchSkills = new BehaviorSubject<string[]>([]);

    // construct database
    constructor(private db: AngularFirestore) {
        this._communityCollection = db.collection('community');
    }

    /* ** Initial Calls ** */
    // Main calls
    getCommunities(uid: string) {
        return communities;
    }
    init(id: string): BehaviorSubject<string> {
        this.communityID = id;
        return this._communityName;
    }
    // Setters for init
    set communityID(id: string) {
        this._communityID.next(id);
        this.getCommunityData(id); // Calls set comData then set community
    }
    get communityID(): string {
        return this._communityID.getValue();
    }
    // Init pt 2 called to set basic data
    set communityData(comData: ICommunityData) {
        this._communityName.next(comData.name);
        this._communityData.next(comData);
    }
    // Init pt 3 called when all data loaded to prevent errors
    set community(community: ICommunityData) {
        this.communityData = community;
        this._members.next(community.members); // Remove this (its here for tests)?
        this._messages.next(community.messages);
    }
    get community(): ICommunityData {
        return this._communityData.getValue();
    }


    /* ** Initial gets  ** */
    // Community variables
    get name(): string {
        return this._communityName.getValue();
    }
    // Members
    get members(): Observable<IUser[]> {
        return this._members.asObservable();
    }
    /*
    getMember(ref: DocumentReference) {
        const newUser: IUser<IUserData>;
        ref.collection('userData').doc('tags').get().then(tagSnap => {
            const tags: ITags = <any>tagSnap.data();
            newUser.passions = tags.passions;
            newUser.skills = tags.
        })
    }
    */
    getMembers(batch: string, lastKey?: string, pushUser = true): IUser[] {
        // this.db.collection('users').get()
        return this._members.getValue();
    }
    /*
    getMembers(batch: string, lastKey?: string) {
    }

    getMembers(batch: number, lastKey = 0) {
        const startNumber = batch - lastKey;
        return this._members.getValue().slice(startNumber, batch);
    }
    */
    // Messages
    get messages(): Observable<IMessage[]> {
        return this._messages;
    }
    set showWeb(show: boolean) {
        this._showWeb.next(show);
    }

    // Skills
    set skills(skills: ICommunitySkills[]) {
        this._skills.next(skills);
        const data = this._communityData.getValue();
        data.skills = skills;
        this._communityData.next(data);
    }
    get skills(): ICommunitySkills[] {
        return this._skills.getValue();
    }

    /* ** Search parameters ** */
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

    /* ** Firebase ** */
    getCommunity(id?: string): boolean {
        // TODO: Replace this with link finder
        return !!detailCommunities[Communities[id]];
    }
    // Called by initial setters
    getCommunityData(id?: string) {
        const currentID = id ? id : this._communityID.getValue();
        this._communityCollection.doc(currentID).ref.get().then(val => {
            if (val.exists)
                return val;
            else
                throw new Error('Community DNE');
        }).then(val => {
            const comData: IfbComData = <any>val.data();
            this.communityData = {
                link: currentID,
                members: [],
                messages: [],
                name: comData.name
            };
            return val.ref.collection('communityData').doc('members').get().then(memberSnap => {
                if (memberSnap.exists)
                    return this.setMembers(memberSnap.data()).then(mems => mems);
                else
                    throw new Error('Community members not found');
            }).then(users => {
                return val.ref.collection('communityData').doc('messages').get().then(messageSnap => {
                    // tslint:disable-next-line:curly
                    if (messageSnap.exists) {
                        /*
                        (messageSnap as DocumentReference).get().then(mess => {
                            if (mess.exists)
                            mess.data()
                        })
                        */
                        // (messageSnap.data()['ref'] as DocumentReference).get().then()
                        return { usr: users, msg: [] };
                    } else {
                        console.log('else');
                        throw new Error('messages DNE');
                    }
                });
            }).then(newData => {
                // this is temporary
                const testMembers: IUser[] = [];
                newData.usr.forEach(memb => testMembers.push(memb, memb, memb, memb));
                // end temp use the newData.urs in the return
                return {
                    link: currentID,
                    members: testMembers,
                    // members: newData.usr,
                    messages: newData.msg,
                    name: comData.name
                };
            });
        }).then(comData => {
            this.communityData = comData;
            this.community = comData;
            console.log(comData);
        }).catch(error => {
            console.error('database error', error);
            throw new Error(error);
        });
        // return detailCommunities[Communities[currentID]];
        // return detailCommunities[parsed];
    }

    setMembers(membs: DocumentData): Promise<IUser[]> {
        const users = <{ founder: DocumentReference, members: Array<DocumentReference> }>membs;
        const members: IUser[] = this._members.getValue().slice();
        return new Promise<IUser[]>((res, rej) => {
        for (let i = 0; i < users.members.length; i++) {
            const member = users.members[i];
            member.collection('userData').doc('tags').get().then(tagSnap => {
                if (tagSnap.exists) {
                    const tags: ITags = <any>tagSnap.data();
                    return {
                        pass: tags.passions,
                        skill: tags.skills,
                        paym: tags.paymentForm,
                        img: '',
                    };
                } else throw new Error('Cannot get user tags');
            }).then(usrData => {
                return member.get().then(m => {
                    if (m.exists) {
                        const memberData: IUser = <any>m.data();
                        return (memberData.imgUrl as DocumentReference).get().then(img => {
                            if (img.exists)
                                usrData.img = img.data()['else'] as string;
                            return usrData;
                        }).then(newData => {
                            return <IUser>{
                                connections: memberData.connections,
                                imgUrl: newData.img,
                                location: memberData.location,
                                name: memberData.name,
                                passions: newData.pass,
                                skills: newData.skill
                            };
                        });
                    } else throw new Error('cannot get user data');
                });
            }).then(user => {
                members.push(user);
                this._members.next(members);
                // console.log(this._members.getValue());
                if (i = users.members.length)
                    res(members);
            }).catch(error => {
                console.error('Error while getting members', error);
                rej(error);
            });
        }
        });
    }

    // Helpers
    makeSmall(isSmall: boolean) {
        this._navSmall.next(isSmall);
    }
    isSmall(): Observable<boolean> {
        return this._navSmall.asObservable();
    }
}
interface IfbComData extends DocumentData {
    desc: string;
    img: DocumentReference;
    location: DocumentReference;
    members: number;
    name: string;
}
// Names
const baxter: IUser = {
    name: 'Baxter Cochennet',
    userData: {
        profile: {
            fName: 'Baxter',
            lName: 'Cochennet',
            about: 'Simple about',
            email: 'fakeEmail@mail.com',
        },
        tags: {
            passions: ['Cycling', 'Fly Fishing', 'Photography', 'SUP', 'Cliff Jumping', 'Community'],
            skills: ['Accounting', 'Personal Finance', 'Budgeting', 'Photography'],
            paymentForm: [Payments['Nothing, happy to help']]
        }
    },
    skills: ['Accounting', 'Personal Finance', 'Budgeting', 'Photography'],
    passions: ['Cycling', 'Fly Fishing', 'Photography', 'SUP', 'Cliff Jumping', 'Community'],
    location: 'Denver',
    connections: 15,
    imgUrl: '/assets/img/photos/baxter.jpg'
};
const me: IUser = {
    name: 'Andrei Parrent',
    userData: {
        profile: {
            fName: 'Andrei',
            lName: 'Parrent',
            about: `After the inception of Sourcerer, I have been working on an ever growing list of code technique to further
             my coding passion.I am constantly looking for new opportunities to expand my knowledge of technologies
             and produce works I am proud of.`,
             email: 'dreiparrent@gmail.com'
        },
        tags: {
            skills: ['Code', 'Web Design', 'Other Stuff'],
            passions: ['PWA', 'Web Design'],
            paymentForm: [Payments.Cash, Payments.Pizza]
        }
    },
    skills: ['Code', 'Web Design', 'Other Stuff'],
    passions: ['PWA', 'Web Design'],
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
    members: <IUser[]>[baxter, me, baxter, me, baxter, me, baxter, me],
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