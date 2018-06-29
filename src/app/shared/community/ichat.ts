import { IUser } from './community-interfaces';
import { Observable, BehaviorSubject } from 'rxjs';
import { IMessage } from './chat.service';
import { AngularFirestoreCollection, AngularFirestore, DocumentSnapshot, DocumentChange } from 'angularfire2/firestore';
import { AuthService } from '../auth/auth.service';
import { CommunityService } from './community.service';
import { DocumentReference } from '@firebase/firestore-types';

export interface IChatInterface {
    user?: IUser;
    cUserIndex?: number;
    users: DocumentReference[];
    userData?: IUser[];
    subject: string;
    messages?: Observable<IMessage[]>;
    ref?: DocumentReference;
    last?: string;
    newMessage?: boolean;
    currentIndex?: number;
    hasExtra: boolean;
}
export class IChat implements IChatInterface {

    // Extras
    private _messages = new BehaviorSubject<IMessage[]>([]);
    private _getMessage = true;
    private _dbChatRef: AngularFirestoreCollection;
    private _snapListener: () => void;
    private _messageAwaiter = new BehaviorSubject<number>(-1);
    private _startAt: number;
    private get _endAt() {
        return this._startAt + this.limit;
    }
    public limit = 10;

    private bleh = 1;

    // Chat Interface
    public user: IUser;
    public cUserIndex: number;
    public readonly users: DocumentReference[];
    public readonly userData: IUser[] = [];
    public readonly subject: string;
    get messages() {
        if (this._getMessage) {
            this._getMessage = false;
            this.loadMore();
        }
        return this._messages.asObservable();
    }
    public readonly ref: DocumentReference;
    public readonly last: string;
    public get hasExtra() {
        return this._endAt <= this.limit;
    }

    constructor(private db: AngularFirestore,
        private _authService: AuthService,
        private _comService: CommunityService,
        private _dataSnap: DocumentSnapshot<IChatInterface>,
        public newMessage = false) {
        const data = _dataSnap.data();
        // Set Interface
        this.ref = _dataSnap.ref;
        this._startAt = data.currentIndex;
        this.subject = data.subject;
        this.last = data.last;
        this.users = data.users;
        this.sortUsers();
    }
    private sortUsers() {
        this.users.forEach(userRef => {
            if (userRef.id === this._authService.token) {
                this.cUserIndex = this.users.indexOf(userRef);
                this.userData.push(this._authService.currentUser);
            } else
                this._comService.getMember(userRef.id).then(user => {
                    this.user = user;
                    this.userData.push(user);
                });
        });
    }

    private getMessages(mesSnap: DocumentChange<any>[], index = true): Promise<any> {
        console.log('get messages', this._startAt, this._endAt);
        return new Promise<void>(resolve => {
            mesSnap.forEach(snap => {
                const snapData: IMessage = snap.doc.data() as any;
                const userIndex = snapData.user;
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
                if (index)
                this._startAt += 1;
                if (snapData.index < this.bleh) {
                    this.bleh = snapData.index;
                    curMes.push(snapData);
                } else
                    curMes.unshift(snapData);
                // console.log(this._messages.getValue(), curMes);
                this._messages.next(curMes);
                console.log('get messages', this._startAt, this._endAt);
            });
            resolve();
        });
    }

    public loadMore() {
        return this.ref.collection('messages').orderBy('index').startAt(this._startAt).endAt(this._endAt)
            .get().then(mesSnap => this.getMessages(mesSnap.docChanges()));
    }

    public listen() {
        if (this._getMessage) {
            this._getMessage = false;
            this.loadMore().then(() => {
                this.listen();
            });
        } else
            this._snapListener = this.ref.collection('messages').orderBy('index').endBefore(this.bleh)
                .onSnapshot(mesSnap => { this.getMessages(mesSnap.docChanges(), false); });
    }

    public unsubscribe() {
        this._snapListener();
    }

    sendMessage(message: string): Promise<Observable<number>> {
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
}

/*
export interface IChat {
    user?: IUser;
    cUserIndex?: number;
    users: DocumentReference[];
    userData?: IUser[];
    subject: string;
    messages?: IMessage[];
    ref?: DocumentReference;
    last?: string;
    newMessage?: boolean;
}
*/