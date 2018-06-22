import { Injectable } from '@angular/core';
import { Payments, IUser } from './community-interfaces';
import { Observable, Subject, BehaviorSubject, of, from, merge } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NavigationService } from '../navigation/navigation-service';
import { DocumentReference } from '@firebase/firestore-types';
import { CommunityService } from './community.service';
import { map, concatMap } from 'rxjs/operators';

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
        this._currentMessages.next(messages);
    }
    private get currentMessages() {
        return this._currentMessages.getValue();
    }
    public get messages() {
        return this._currentMessages.asObservable();
    }

    constructor(private authService: AuthService, private comService: CommunityService, private navService: NavigationService) {
        this.authService.getChats();
        this.authService._newChat.subscribe(newChat => {
            this.getChat(newChat).then(chatData => this.currentChats.push(chatData));
        });
    }

    getMessages(chat: IChat, reset = true) {
        if (reset)
            this.currentMessages = [];
        return chat.ref.collection('messages').get().then(mesSnap => {
            if (!mesSnap.empty) {
                mesSnap.forEach(snap => {
                    const snapData: IMessage = snap.data() as any;
                    const userIndex = snapData.user;
                    if (userIndex === chat.cUserIndex) {
                        snapData.userName = 'You';
                        snapData.imgUrl = this.authService.currentUser.imgUrl as string;
                    } else {
                        snapData.userName = chat.userData[userIndex].name;
                        snapData.imgUrl = chat.userData[userIndex].imgUrl as string;
                    }
                    this.currentMessages.push(snapData);
                });
                return true;
            } else return false;
        });
        // return this._currentMessages.asObservable();
    }

    startNewChat(profile: IUser) {
        if (this.authService.isAuth) {
            this.navService.setOpen(true);
            this.navService.currentTab = 1;
            this.currentMessages = [];
        }
    }

    getChat(ref: DocumentReference, userChat = true): Promise<IChat> {
        return ref.get().then(chatSnap => {
            if (chatSnap.exists) {
                const chatData: IChat = chatSnap.data() as any;
                chatData.ref = chatSnap.ref;
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
                return chatData;
            }
        }).then().then().catch(error => {
            throw new Error(error);
        });
    }

    newMessage() {
        console.log('newMessage');
    }

    /*
    private getMessages(messageId: DocumentReference, userChat = true) {
        messageId.get().then(chatSnap => {
            if (!chatSnap.exists)
                return chatSnap.data() as any;
            else throw new Error('Cannot get messages');
        }).then((chat: IChat) => {
            this.userChats.push(chat);
        });
    }
    */
    private setMessages() {
        // this.currentMessages = this._sampleChat.getValue()[0].messages;
    }

    sendMessage(message: string): Promise<boolean> {
        const tmpPromise = new Promise<boolean>((resolve, reject) => {
            setTimeout(() => {
                this.currentMessages.push({
                    text: message,
                    user: null,
                    userName: 'You'
                });
                const rands = [false, true, true, true];
                const random = Math.floor(Math.random() * rands.length);
                resolve(rands[random]);
            }, 2000);
        });
        return tmpPromise;
    }
}
export interface IMessage {
    text: string;
    user: number;
    imgUrl?: string;
    userName?: string;
}
export interface IChat {
    user?: IUser;
    cUserIndex?: number;
    users: DocumentReference[];
    userData?: IUser[];
    subject: string;
    messages?: IMessage[];
    ref?: DocumentReference;
    last?: string;
}