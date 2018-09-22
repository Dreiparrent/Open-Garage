import { IUser } from './community-interfaces';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore, DocumentSnapshot, DocumentChange } from 'angularfire2/firestore';
import { AuthService } from '../auth/auth.service';
import { CommunityService } from './community.service';
import { DocumentReference } from '@firebase/firestore-types';
import { firestore } from 'firebase';

export interface IMessage {
    text: string;
    user: number;
    imgUrl?: string;
    userName?: string;
    timestamp: firestore.Timestamp;
    ref: DocumentReference;
}

export interface IChat {
    user?: IUser;
    cUserIndex?: number;
    users: DocumentReference[];
    userData?: IUser[];
    subject: string;
    messages?: Observable<IMessage[]>;
    ref?: DocumentReference;
    last?: string;
    newMessage?: boolean;
    timestamp?: firestore.Timestamp;
    count?: number;
    hasExtra: boolean;
}
/*
currentIndex
last
subject
users
*/
/*
index
text
timestamp
user
*/
export class Chat implements IChat {

    // Extras
    private _messages = new BehaviorSubject<IMessage[]>([]);
    private _getMessage = true;
    private _snapListener: () => void;
    private _messageAwaiter = new BehaviorSubject<number>(-1);
    private _startAfter = firestore.Timestamp.now();
    private _endBefore = firestore.Timestamp.now();
    public limit = 10;

    // Chat Interface
    public user: IUser;
    public cUserIndex: number;
    public users: DocumentReference[];
    public readonly userData: IUser[] = [];
    public readonly subject: string;
    get messages() {
        if (this._getMessage)
            this.loadMore();
        return this._messages.asObservable();
    }
    public connection = false;
    public count = 0;
    public readonly ref: DocumentReference;
    public get hasExtra() {
        return this._messages.getValue().length < this.count;
    }

    static startNewChat(db: AngularFirestore, auth: AuthService, _comService: CommunityService,
        user: IUser, subject: string): Promise<Chat> {
        if (auth.isAuth)
            return db.collection('message/users/chats').add({
                users: [auth.userRef, user.ref],
                newChat: true,
                subject: subject
            }).then(ref => ref.get())
                .then((snap: DocumentSnapshot<IChat>) => new Chat(db, auth, null, snap, firestore.Timestamp.now()))
                .catch(error => {
                    // this.alertService.addAlert(Alerts.custom, { msg: 'An error occured while starting new chat', type: 'warning' });
                    console.log(error);
                    return null;
                });
        else return null;
    }

    constructor(private db: AngularFirestore, private _authService: AuthService,
        private _comService: CommunityService, private _dataSnap: DocumentSnapshot<IChat>,
        public timestamp: firestore.Timestamp, public newMessage = false) {
        const data = _dataSnap.data();
        // Set Interface
        this.ref = _dataSnap.ref;
        this.subject = data.subject;
        this.count = data.count;
        this.connection = data.count > 4;
        if (data.users) {
            this.users = data.users;
            this.sortUsers();
        } else
            _comService.members.subscribe(membs => {
                if (membs.length === _comService.memberCount) {
                    this.users = membs.map(mem => mem.ref);
                    this.sortUsers(_comService.getMembers('fake'));
                }
            });
    }
    private sortUsers(comMembers?: IUser[]) {
        this.users.forEach((userRef, i) => {
            if (userRef.id === this._authService.token) {
                this.cUserIndex = this.users.indexOf(userRef);
                this.userData.push(this._authService.currentUser);
            } else
                if (comMembers)
                    this.userData.push(comMembers[i]);
                else
                    this._comService.getMember(userRef.id).then(user => {
                        this.user = user;
                        this.userData.push(user);
                    });
        });
    }

    private getMessages(mesSnap: DocumentChange<any>[], index = true): Promise<any> {
        return new Promise<any>(resolve => {
            mesSnap.forEach(snap => {
                const snapData: IMessage = snap.doc.data() as any;
                const userIndex = snapData.user;
                const timestamp = snapData.timestamp;
                snapData.ref = snap.doc.ref;
                if (userIndex === this.cUserIndex) {
                    snapData.userName = 'You';
                    snapData.imgUrl = this._authService.currentUser.imgUrl as string;
                    if (this._messageAwaiter.getValue() === 0)
                        this._messageAwaiter.next(1);
                } else {
                    snapData.userName = this.userData[userIndex].name;
                    snapData.imgUrl = this.userData[userIndex].imgUrl as string;
                }
                const curMes = this._messages.getValue();
                if (this._startAfter > timestamp) {
                    this._startAfter = timestamp;
                    curMes.unshift(snapData);
                } else {
                    this.count += 1;
                    this._endBefore = timestamp;
                    curMes.push(snapData);
                }
                this._messages.next(curMes);
            });
            resolve();
        });
    }

    public loadMore(): Promise<IMessage[]> {
        this._getMessage = false;
        return this.ref.collection('messages').orderBy('timestamp', 'desc').startAfter(this._startAfter).limit(this.limit)
            .get().then(mesSnap => this.getMessages(mesSnap.docChanges())).then(() => this._messages.getValue())
            .catch(error => {
                console.log(error);
                return null;
            });
    }

    public listen() {
        if (this._getMessage)
            this.loadMore().then(() => {
                this.listen();
            });
        else
            this._snapListener = this.ref.collection('messages').orderBy('timestamp', 'desc').endBefore(this._endBefore)
                .onSnapshot(mesSnap => { this.getMessages(mesSnap.docChanges(), false); }, error => console.log(error));
    }

    public unsubscribe() {
        this._snapListener();
    }

    public sendMessage(message: string): Promise<Observable<number>> {
        this._messageAwaiter.next(-1);
        return this.ref.update({
            newMessage: {
                text: message,
                user: this.cUserIndex,
                uuid: this._authService.token
            }
        }).catch(error => {
            console.log(error);
            return this._messageAwaiter;
        }).then(() => {
            this._messageAwaiter.next(0);
            return this._messageAwaiter;
        });
    }

    /*
    startNewChat(profile: IUser, subject: string) {
        if (this.authService.isAuth) {
            this.navService.setOpen(true);
            this.navService.currentTab = 1;
            this.resetChat();
            this._dbChatRef.add(<Chat><any>{
                users: [this.authService.userRef, profile.ref],
                newChat: true,
                subject: subject
            }).then(ref => {
                this._currentChatRef = ref;
            }).catch(error => {
                this.alertService.addAlert(Alerts.custom, { msg: 'An error occured while starting new chat', type: 'warning' });
                console.log(error);
            });
        }
    }
    */
}