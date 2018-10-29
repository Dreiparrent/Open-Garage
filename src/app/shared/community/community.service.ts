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
import { AngularFireStorage } from 'angularfire2/storage';
import { DocumentReference, DocumentData } from '@firebase/firestore-types';
import { AlertService, Alerts } from '../alerts/alert.service';
import { Chat, IChat } from './chat';

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
    private _comImg = new BehaviorSubject<IImg>(null);
    public memberCount: number;
    // private _messages = new Subject<IMessage[]>();
    private _messageRef = new BehaviorSubject<DocumentReference>(null);

    private _searchValue = new BehaviorSubject('');
    private _searchType = new BehaviorSubject(-1);
    private _searchMembers = new BehaviorSubject<string[]>([]);
    private _searchSkills = new BehaviorSubject<string[]>([]);
    private _clickMembers = new BehaviorSubject<IUser[]>([]);
    private _communityProgress = new BehaviorSubject(0);

    // construct database
    constructor(private db: AngularFirestore, private alertService: AlertService, private fireStorage: AngularFireStorage) {
        this._communityCollection = db.collection('community');
    }

//#region ** Initial Calls **
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
        this.getCommunityData(id, true); // Calls set comData then set community
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
    get comImg(): Observable<IImg> {
        return this._comImg.asObservable();
    }
    get communityProgress() {
        return this._communityProgress.getValue();
    }
//#endregion

//#region ** Initial gets  **
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
//#endregion

//#region ** Search parameters **
    updateSearch(members: string[] = [], skills: string[] = [], searchValue: string = '', type: CommunitySearchType = -1) {
        // this._searchMembers.next(members);
        const users = this._members.getValue().filter(m => m.skills.includes(skills[0]) || members.includes(m.name));
        this._clickMembers.next(users);
        if (members.length < 1 && skills.length > 0)
            this._searchMembers.next(users.map(u => u.name));
        else this._searchMembers.next(members);
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
    get clickMember(): BehaviorSubject<IUser[]> {
        return this._clickMembers;
    }
//#endregion

//#region ** Firebase **
    getCommunity(id?: string, img = false, progress = false): Promise<ICommunity> {
        const currentID = id ? id : this._communityID.getValue();
        // this._communityProgress.next(5);
        return this._communityCollection.doc(currentID).ref.get().then(comSnap => {
            if (comSnap.exists)
                return comSnap.data() as IfbComData;
            else
                throw new Error('Unable to fetch community');
        }).then(comData => {
            if (progress)
                this._communityProgress.next(20);
            this.memberCount = comData.members;
            if (img)
                return this.fireStorage.storage.refFromURL(comData.img as string).getDownloadURL()
                    .then((url: string) => {
                        if (progress)
                            this._communityProgress.next(25);
                        return url;
                        // return usrData;
                    }, error => {
                        return placeholderUrl;
                    }).then(elseUrl => {
                        if (elseUrl) {
                            const getUrl = (comData.img as string).split('.');
                            getUrl.pop();
                            getUrl.push('webp');
                            const webpUrl = getUrl.join('.');
                            return this.fireStorage.storage.refFromURL(webpUrl).getDownloadURL().then((url: string) => {
                                return { else: elseUrl, webp: url };
                            }, error => {
                                return { else: placeholderUrl };
                            });
                        }
                    }).then(imgData => {
                        this._comImg.next(imgData);
                        return comData.location.get().then(locationSnap => {
                            // this._communityProgress.next(40);
                            if (locationSnap.exists)
                                return <ICommunity>{
                                    desc: comData.desc,
                                    img: imgData,
                                    link: currentID,
                                    location: locationSnap.data()['location'],
                                    nav: locationSnap.data()['nav'],
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
    getCommunityData(id?: string, img = false) {
        const currentID = id ? id : this._communityID.getValue();
        this.getCommunity(currentID, img, true).then(val => {
            this._communityProgress.next(50);
            return this._communityCollection.doc(currentID).collection('communityData')
                .doc('members').ref.get().then(memberSnap => {
                    this._communityProgress.next(60);
                    if (memberSnap.exists)
                        return this.setMembers(memberSnap.data());
                    else
                        throw new Error('Community members not found');
                }).then(users => {
                    this._communityProgress.next(75);
                return { usr: users, msg: this.db.collection('message/community/chats').doc(currentID).ref };
                }).then(newData => {
                    this._communityProgress.next(85);
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
            this._communityProgress.next(100);
            this.communityData = comData;
            this.community = comData;
        }).catch(error => {
            console.error('database error', error);
            throw new Error(error);
        });
        // return detailCommunities[Communities[currentID]];
        // return detailCommunities[parsed];
    }

    setMembers(membs: DocumentData, setMembers = true): Promise<IUser[]> {
        const users = <{ founder: DocumentReference, members: Array<DocumentReference> }>membs;
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
                // this._communityProgress.next(65);
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
                    // this._communityProgress.next(70);
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
        img: placeholderUrl as string | IImg
    }) {
        return this.db.collection('users').doc(id).ref.get().then(m => {
            if (m.exists) {
                const memberData: IUser = <any>m.data();
                return Promise.resolve().then(() => {
                    if (!memberData.imgUrl) {
                        usrData.img = { else: placeholderUrl };
                        return usrData;
                    } else return this.fireStorage.storage.refFromURL(memberData.imgUrl as string).getDownloadURL()
                        .then((url: string) => {
                            return url;
                            // return usrData;
                        }, error => {
                            return null;
                        }).then(elseUrl => {
                            if (elseUrl) {
                                const getUrl = (memberData.imgUrl as string).split('.');
                                getUrl.pop();
                                getUrl.push('webp');
                                const webpUrl = getUrl.join('.');
                                return this.fireStorage.storage.refFromURL(webpUrl).getDownloadURL().then(url => {
                                    usrData.img = {else: elseUrl, webp: url};
                                    return usrData;
                                }, error => {
                                    usrData.img = { else: elseUrl };
                                    return usrData;
                                });
                            }
                        });
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
        }).then(() => this.addCommunityToUser(authToken));
    }
    addCommunityToUser(authToken: string) {
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
    }
    getUrl(url: string): Promise<boolean> {
        return this._communityCollection.doc(url).ref.get().then(doc => {
            return doc.exists;
        });
    }
    createCommunity(registerData: IRegisterCommunity): Promise<any> {
        console.log(registerData);
        return this._communityCollection.doc(registerData.link).set(registerData).then(() => {
            setTimeout(() => {
                return true;
            }, 1000);
        });
    }

    // Helpers
    makeSmall(isSmall: boolean) {
        this._navSmall.next(isSmall);
    }
    isSmall(): Observable<boolean> {
        return this._navSmall.asObservable();
    }
//#endregion
}
// Names
const blankData: ICommunityData = {
    name: '',
    members: [],
    messageRef: undefined
};
interface IRegisterCommunity {
    new: boolean;
    name: string;
    link: string;
    location: {
        name: string,
        nav: any
    };
    desc: string;
    img?: any;
    members: number;
    founder: DocumentReference;
}