import { Injectable } from '@angular/core';
import {
    ICommunity, ICommunityData, IProfile, IMessage, ICommunitySkills, CommunitySearchType, Payments,
    IUser,
    IUserData,
    ITags,
    IImg,
    placeholderUrl,
    IfbComData
} from './community-interfaces';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, DocumentSnapshot, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DocumentReference, DocumentData } from '@firebase/firestore-types';
import { AlertService, Alerts } from '../alerts/alert.service';
import { Chat, IChat } from './chat';
import { AuthService } from '../auth/auth.service';

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
    // private _messages = new Subject<IMessage[]>();
    private _messageRef = new BehaviorSubject<DocumentReference>(null);

    private _searchValue = new BehaviorSubject<string>('');
    private _searchType = new BehaviorSubject<number>(-1);
    private _searchMembers = new BehaviorSubject<string[]>([]);
    private _searchSkills = new BehaviorSubject<string[]>([]);

    // construct database
    constructor(private db: AngularFirestore, private alertService: AlertService) {
        this._communityCollection = db.collection('community');
    }

    /* ** Initial Calls ** */
    resetCommunity() {
        this._communityData.next(blankData);
        // this. _communityName = new BehaviorSubject('');
        this._skills.next([]);
        this._members.next([]);
        this._messageRef.next(null);
    }
    // Main calls
    init(id: string): BehaviorSubject<string> {
        if (id === this.communityID)
            return this._communityName;
        this.resetCommunity();
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
        this._members.next(community.members); // TODO: Remove this (its here for tests)?
        this._messageRef.next(community.messageRef);
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
    getMembers(batch: string, lastKey?: string, pushUser = true): IUser[] {
        // this.db.collection('users').get()
        return this._members.getValue();
    }
    // Messages
    get messageRef(): Observable<DocumentReference> {
        return this._messageRef.asObservable();
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
    getCommunity(id?: string, img = false): Promise<ICommunity> {
        const currentID = id ? id : this._communityID.getValue();
        return this._communityCollection.doc(currentID).ref.get().then(comSnap => {
            if (comSnap.exists)
                return comSnap.data() as IfbComData;
            else
                throw new Error('Unable to fetch community');
        }).then(comData => {
            if (img)
                return comData.img.get().then(imgSnap => {
                    if (imgSnap.exists)
                        return imgSnap.data() as IImg;
                    else return <IImg>{
                        else: placeholderUrl
                    };
                }).then(imgData => {
                    return comData.location.get().then(locationSnap => {
                        if (locationSnap.exists)
                            return <ICommunity>{
                                desc: comData.desc,
                                img: imgData,
                                link: currentID,
                                location: locationSnap.data()['location'],
                                members: comData.members,
                                name: comData.name
                            };
                        else throw new Error('Unable to fetch community location');
                    });
                });
            return <ICommunity>{
                link: currentID,
                members: comData.members,
                name: comData.name,
                desc: comData.desc,
                img: comData.img,
            };
        }).catch(error => {
            this.alertService.addAlert(Alerts.communityError);
            throw new Error(error);
        });
    }
    // Called by initial setters
    getCommunityData(id?: string) {
        const currentID = id ? id : this._communityID.getValue();
        this.getCommunity(currentID).then(val => {
            return this._communityCollection.doc(currentID).collection('communityData')
                .doc('members').ref.get().then(memberSnap => {
                if (memberSnap.exists)
                    return this.setMembers(memberSnap.data());
                else
                    throw new Error('Community members not found');
            }).then(users => {
                return { usr: users, msg: this.db.collection('message/community/chats').doc(currentID).ref };
            }).then(newData => {
                // this is temporary
                const testMembers: IUser[] = [];
                newData.usr.forEach(memb => testMembers.push(memb));
                // end temp use the newData.urs in the return
                return {
                    link: currentID,
                    members: testMembers,
                    // members: newData.usr,
                    messageRef: newData.msg,
                    name: val.name
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

    setMembers(membs: DocumentData, setMembers = true): Promise<IUser[]> {
        const users = <{ founder: DocumentReference, members: Array<DocumentReference> }>membs;
        console.log(users);
        let members: IUser[];
        if (setMembers)
            members = this._members.getValue().slice();
        else members = [];
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
                        img: placeholderUrl,
                    };
                } else throw new Error('Cannot get user tags');
            }).then(usrData => {
                if (!setMembers)
                    return this.getMember(member.id, usrData).then(newUserData => {
                        return member.collection('userData').doc('profile').get().then(profileSnap => {
                            if (profileSnap.exists)
                                return profileSnap.data() as IProfile;
                            else throw new Error('Cannot get profile data');
                        }).then(profileData => {
                            const newUser = newUserData;
                            newUser.userData = {
                                profile: profileData,
                                tags: {
                                    passions: usrData.pass,
                                    paymentForm: usrData.paym,
                                    skills: usrData.skill
                                }
                            };
                            return newUser;
                        });
                    });
                else return this.getMember(member.id, usrData);
            }).then(user => {
                members.push(user);
                if (setMembers)
                    this._members.next(members);
                if (i === users.members.length - 1)
                    res(members);
            }).catch(error => {
                console.error('Error while getting members', error);
                rej(error);
            });
        }
        });
    }

    getMember(id: string, usrData = {
        pass: [],
        skill: [],
        paym: null,
        img: placeholderUrl
    }) {
        return this.db.collection('users').doc(id).ref.get().then(m => {
            if (m.exists) {
                const memberData: IUser = <any>m.data();
                if (!memberData.imgUrl)
                    memberData.imgUrl = this.db.collection('images').doc('placehiolder').ref;
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
                        skills: newData.skill,
                        ref: m.ref
                    };
                });
            } else {
                this.alertService.addAlert(Alerts.userError);
                throw new Error('cannot get user data');
            }
        });
    }

    joinCommunity(authToken: string): Promise<boolean> {
        return this._communityCollection.doc(this.communityID).ref.update({
            join: authToken
        }).then(result => {
            return new Promise<boolean>((resolve, reject) => {
                const unSub = this._communityCollection.doc(this.communityID).collection('communityData').doc('members').ref
                    .onSnapshot(changeSnap => {
                        const newMembers: DocumentReference[] = changeSnap.data()['members'];
                        console.log('New Members', newMembers);
                        const addedToken = newMembers.filter(member => member.id === authToken);
                        console.log('New Members', addedToken);
                        if (addedToken.length > 0)
                            resolve(true);
                        // else return false;
                    });
                setTimeout(() => {
                    resolve(false);
                }, 10000);
            });
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
// Names
const blankData: ICommunityData = {
    name: '',
    members: [],
    messageRef: undefined
};