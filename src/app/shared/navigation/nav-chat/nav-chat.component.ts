import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { IProfile } from '../../community/community-interfaces';
import { ChatService, IMessage } from '../../community/chat.service';
import { Observable, Subscription, BehaviorSubject, interval, } from 'rxjs';
import { MyErrorStateMatcher } from '../../../pages/register-page/ragister-validator';
import { startWith, map, mapTo, take } from 'rxjs/operators';
import { DocumentReference } from '@firebase/firestore-types';
import { NavigationService } from '../navigation-service';
import { IChat } from '../../community/ichat';

@Component({
    selector: 'app-nav-chat',
    templateUrl: './nav-chat.component.html',
    styleUrls: ['./nav-chat.component.scss']
})
export class NavChatComponent implements OnInit, OnDestroy {

    searchControl: FormControl = new FormControl();
    messageControl: FormControl = new FormControl('', [() => this.messageErrors()]);

    matcher = new MyErrorStateMatcher();

    userChats: IChat[];
    filteredChats: Observable<IChat[]>;

    filteredOptions: Observable<any[]>;
    // options = new Observable<string[]>();
    get options() {
        const mesArray = this.userChats.slice().map(chat => chat.messages);
        return this.userChats.slice().map(chat => chat.user.name);
    }
    get selectIndex() {
        return this.chatService.currentTab;
    }
    set selectIndex(index: number) {
        this.chatService.currentTab = index;
    }
    messageName = '';

    searchBuf = 100;
    searchProg = 0;
    searchCol: 'primary' | 'accent' | 'warn' = 'primary';

    chatBuf = 100;
    chatProg = 100;
    chatCol: 'primary' | 'accent' | 'warn' = 'primary';

    @ViewChild('messageInput') messageInput: ElementRef<HTMLInputElement>;
    @Output() isMessageChange = new EventEmitter();
    private _isMessage = false;
    @Input('isMessage')
    get isMessage() {
        return this.selectIndex === 1;
    }
    set isMessage(isMessage: boolean) {
        this.selectIndex = isMessage ? 1 : 0;
        this.isMessageChange.emit(isMessage);
    }
    currentChat: IChat;
    /*
    get messages(): Observable<IMessage[]> {
        return this.chatService.messages;
    }
    */

    constructor(private chatService: ChatService, private navService: NavigationService) {
        this.filteredOptions = this.searchControl.valueChanges.pipe(
            startWith(''),
            map(param => param ? this.filterOptions(param) : [])
        );
        this.filteredChats = this.searchControl.valueChanges.pipe(
            startWith(''),
            map(param => param ? this.filterChats(param) : this.userChats)
        );
        /*    .toPromise().then(chats => {
            this.searchBuf = 0;
            this.searchProg = 0;
            return chats;
        });*/
    }

    messageErrors(): { [key: string]: boolean } {
        if (this.chatCol === 'warn')
            return { messageSend: true };
        else
            return null;
    }

    ngOnInit() {
        // this.options =
        /*
        this.chatService.chats.pipe(
            map(chats => {
                return chats.map(chat => chat.user.name);
            })
        ).subscribe(val => console.log(val));
        */
        this.chatService.chats.subscribe(chats => {
            this.userChats = chats;
        });
        this.navService.getTab().subscribe(tab => {
            console.log(tab);
        });
        /*
        this.chatService.getChats().subscribe(chats => {
            if (!this.userChats) {
                this.userChats = [];
                this.options = [];
            }
            chats.forEach(chat => {
                const lm = chat.messages.slice(-1)[0];
                this.userChats.push({
                    id: chat.id,
                    subject: chat.subject,
                    messages: chat.messages,
                    user: chat.user,
                    lastMessage: lm
                });
                this.options.push(chat.user.name);
            });
        });
        */
    }

    filterOptions(param: string) {
        return this.options.filter(option => option.toLowerCase().indexOf(param.toLowerCase()) === 0).slice(0, 5);
    }
    filterChats(param: string) {
        const chats = this.userChats.filter(chat => {
            console.log(chat);
            let findMesage = false;
            try {
                console.log(chat.messages);
            } catch (error) {
                console.log(error);
            }
            /*
            const leng = chat.messages.length;
            for (let i = 0; i < leng; i++) {
                this.searchBuf = ((i + 1) / leng) * 100;
                if (chat.messages[i].text.toLowerCase().indexOf(param.toLowerCase()) !== -1)
                    findMesage = true;
            }
            */
            if (chat.user.name.toLowerCase().indexOf(param.toLowerCase()) === 0 || findMesage)
                return true;
            else return false;
        }).slice();
        this.searchBuf = 100;
        return chats;
    }

    searchKeyup(value: string) {
        if (value === '') {
            this.searchBuf = 100;
            return;
        }
        this.filterOptions(value).forEach(val => {
            console.log(val);
        });
    }

    tabChat(chat: IChat) {
        this.messageName = chat.user.name;
        this.selectIndex = 1;
        // const messages = chat.messages;
        chat.listen();
        this.currentChat = chat;
    }

    tabMessage() {
        this.selectIndex = 0;
        this.currentChat.unsubscribe();
    }

    sendMessage(message: string) {
        this.chatProg = 0;
        this.chatBuf = 100;
        const mesVal = message;
        this.messageInput.nativeElement.value = '';
        /*
        setTimeout(() => {
            this.chatBuf = 50;
        }, 1000);
        */
        this.currentChat.sendMessage(message).then(success => {
            this.chatBuf = 0;
            this.chatCol = 'primary';
            let finishSub: Subscription;
            return new Promise<boolean>(resolve => {
                finishSub = success.subscribe(val => {
                    switch (val) {
                        case 1:
                            resolve(true);
                            break;
                        case 0:
                            // let chatVal = 0;
                            const intv = interval(100);
                            const obs = intv.pipe(
                                take(201),
                                map(oVal => oVal)
                                // mapTo(chatVal + 10)
                            ).subscribe(buf => {
                                if (buf < 96)
                                    this.chatBuf = buf;
                                if (buf === 200)
                                    resolve(false);
                            });
                            break;
                        case -1:
                            resolve(false);
                            break;
                    }
                });
            }).then(val => {
                finishSub.unsubscribe();
                if (val) {
                    this.chatProg = 100;
                    this.chatCol = 'primary';
                    this.messageControl.updateValueAndValidity();
                } else {
                    this.chatBuf = 0;
                    this.messageInput.nativeElement.value = mesVal;
                    this.chatCol = 'warn';
                    this.messageControl.updateValueAndValidity();
                }
                console.log('val', val);
            });
        });
        /*
        this.chatService.sendMessage(message).then(success => {
            this.chatBuf = 50;
            this.chatCol = 'primary';
            let finishSub: Subscription;
            return new Promise<boolean>(resolve => {
                finishSub = success.subscribe(val => {
                    switch (val) {
                        case 1:
                            this.chatProg = 100;
                            this.messageControl.updateValueAndValidity();
                            resolve(true);
                            break;
                        case 0:
                            this.chatBuf = 100;
                            break;
                        case -1:
                            this.chatBuf = 0;
                            this.messageInput.nativeElement.value = mesVal;
                            this.chatCol = 'warn';
                            this.messageControl.updateValueAndValidity();
                            resolve(false);
                            break;
                    }
                });
            }).then(val => {
                finishSub.unsubscribe();
            });
        });
        */
    }

    ngOnDestroy(): void {
        // should I unsubscribe?
        // actually I ned to set up the new message notif
        // TODO: new message notif
    }

}
