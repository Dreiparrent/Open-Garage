import { Injectable } from '@angular/core';
import { IUser } from './community-interfaces';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NavigationService } from '../navigation/navigation-service';
import { DocumentReference } from '@firebase/firestore-types';
import { CommunityService } from './community.service';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot, DocumentSnapshot } from 'angularfire2/firestore';
import { AlertService, Alerts } from '../alerts/alert.service';
import { IChat } from './ichat';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    // _sampleChat = new Subject<IChat[]>();
    private _currentTab = new BehaviorSubject<number>(0);
    set currentTab(index: number) {
        this._currentTab.next(index);
    }
    get currentTab() {
        return this._currentTab.getValue();
    }
    private _userChatRefs: DocumentReference[] = [];
    /*
    private get userChatRefs() {
        return this._userChatRefs;
    }
    private set userChatRefs(refs: DocumentReference[]) {
        const newRefs = refs.filter(ref => this._userChatRefs.includes(ref));
        console.log(refs, newRefs);
        this._userChatRefs = refs;
        newRefs.forEach(ref => {
            this.getChat(ref).then(chatData => this.currentChats.push(chatData));
        });
    }
    */
    private readonly _dbChatRef: AngularFirestoreCollection;
    private _currentChatRef: DocumentReference;
    private _currentListener: () => void;
    // private _isAwait;
    messageAwaiter = new BehaviorSubject<number>(-1);
    private _cUserIndex: number;
    // private _sampleChat = new BehaviorSubject<IChat[]>(sampleChat);
    private _currentChats = new BehaviorSubject<IChat[]>([]);
    private set currentChats(chats: IChat[]) {
        this._currentChats.next(chats);
    }
    private get currentChats() {
        return this._currentChats.getValue();
    }
    public get chats() {
        return this._currentChats.asObservable();
    }
    private _currentMessages = new BehaviorSubject<IMessage[]>([]);
    private set currentMessages(messages: IMessage[]) {
        /*
        if (messages.length > 0) {
            const index = this.currentChats.map(chat => chat.ref.id).indexOf(this._currentChatRef.id);
            this.currentChats[index].messages = messages;
            console.log(this.currentChats);
        }
        */
        this._currentMessages.next(messages);
    }
    private get currentMessages() {
        return this._currentMessages.getValue();
    }
    public get messages() {
        return this._currentMessages.asObservable();
    }

    constructor(private authService: AuthService, private comService: CommunityService,
        private navService: NavigationService, private db: AngularFirestore, private alertService: AlertService) {
        this._dbChatRef = db.collection('message').doc('users').collection('chats');
        console.log('ahh');
        /*
        this.authService._userChats.subscribe(newChats => {
            newChats.forEach(chat => {
                this.getChat(chat).then((chatData: IChat) => {
                    console.log('chat data', chatData);
                    if (chatData)
                        this.currentChats.push(chatData);
                });
            });
        });
        */
        /*
        this.authService._newChat.subscribe(newChat => {
            console.log('newChat', newChat);
            this.getChat(newChat).then((chatData: IChat) => {
                console.log('chat data', chatData);
                if (chatData)
                    this.currentChats.push(chatData);
            });
        });
        */
    }

    getMessages(chat: IChat, reset = true, limit: number = null) {
        if (reset)
            this.resetChat();
        /*
        if (chat.newMessage)
            this.authService.userRef.collection('messages').doc(chat.ref.id).set({ ref: chat.ref });
        this._currentListener = chat.ref.collection('messages').orderBy('index').onSnapshot((mesSnap: QuerySnapshot<IMessage[]>) => {
            this._currentChatRef = chat.ref;
            this._cUserIndex = chat.cUserIndex;
            if (!mesSnap.empty) {
                mesSnap.docChanges().forEach(snap => {
                    const snapData: IMessage = snap.doc.data() as any;
                    const userIndex = snapData.user;
                    if (userIndex === this._cUserIndex) {
                        snapData.userName = 'You';
                        snapData.imgUrl = this.authService.currentUser.imgUrl as string;
                        if (this.messageAwaiter.getValue() === 0)
                            this.messageAwaiter.next(1);
                    } else {
                        snapData.userName = chat.userData[userIndex].name;
                        snapData.imgUrl = chat.userData[userIndex].imgUrl as string;
                    }
                    this.currentMessages.push(snapData);
                    const index = this.currentChats.map(ch => ch.ref.id).indexOf(chat.ref.id);
                    this.currentChats[index].messages = this.currentMessages;
                });
                return true;
            } else return false;
        });
        */
    }

    private setMessages(messagesSnap: QuerySnapshot<IMessage>) {

    }

    startNewChat(profile: IUser, subject: string) {
        if (this.authService.isAuth) {
            this.navService.setOpen(true);
            this.navService.currentTab = 1;
            this.resetChat();
            this._dbChatRef.add(<IChat><any>{
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

    getChat(ref: [DocumentReference, boolean], userChat = true): Promise<IChat> {
        if (this._userChatRefs.map(uRef => uRef.id).includes(ref[0].id)) {
            const currentI = this.currentChats.map(ch => ch.ref.id).indexOf(ref[0].id);
            this.currentChats[currentI].newMessage = ref[1];
            return new Promise<IChat>(resolve => resolve(null));
        // tslint:disable-next-line:curly
        } else {
            this._userChatRefs.push(ref[0]);
            return ref[0].get().then(chatSnap => {
                if (chatSnap.exists) {
                    // const chatData: IChat = chatSnap.data() as any;
                    // chatData();
                    const chatData = new IChat(this.db, this.authService, this.comService,
                        chatSnap as DocumentSnapshot<IChat>, ref[1]);
                    // chatData = chatSnap.data();
                    // chatData.ref = chatSnap.ref;
                    // chatData.newMessage = ref[1];
                    /*
                    const userRefs = chatData.users;
                    chatData.userData = [];
                    userRefs.forEach(userRef => {
                        if (userRef.id === this.authService.token)
                        chatData.cUserIndex = userRefs.indexOf(userRef);
                        else
                        this.comService.getMember(userRef.id).then(user => {
                            chatData.userData.push(user);
                            chatData.user = user;
                        });
                    });
                    */
                    // console.log(chatData);
                    return chatData;
                }
            }).then().then().catch(error => {
                throw new Error(error);
            });
        }
    }

    sendMessage(message: string): Promise<Observable<number>> {
        this.messageAwaiter.next(-1);
        if (!this._currentChatRef)
            return new Promise<Observable<number>>(resolve => resolve(this.messageAwaiter));
        return this._currentChatRef.update({
            newMessage: {
                text: message,
                user: this._cUserIndex,
                uuid: this.authService.token
            }
        }).then(() => {
            this.messageAwaiter.next(0);
            return this.messageAwaiter;
        }).catch(error => {
            console.log(error);
            return this.messageAwaiter;
        });
    }

    private resetChat() {
        if (this._currentListener)
            this._currentListener();
        this._currentChatRef = null;
        this._cUserIndex = null;
        this.currentMessages = [];
    }
}
export interface IMessage {
    text: string;
    user: number;
    imgUrl?: string;
    userName?: string;
    index: number;
}