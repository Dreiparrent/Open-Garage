import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { IProfile } from '../../community/community-interfaces';
import { Observable, Subscription, BehaviorSubject, interval, of } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { MyErrorStateMatcher } from '../../../pages/register-page/ragister-validator';
import { startWith, map, mapTo, take, mergeMap } from 'rxjs/operators';
import { DocumentReference } from '@firebase/firestore-types';
import { NavigationService } from '../navigation-service';
import { Chat } from '../../community/chat';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-nav-chat',
    templateUrl: './nav-chat.component.html',
    styleUrls: ['./nav-chat.component.scss']
})
export class NavChatComponent implements OnInit, OnDestroy {

    searchControl: FormControl = new FormControl();
    messageControl: FormControl = new FormControl('', [() => this.messageErrors()]);

    matcher = new MyErrorStateMatcher();

    userChats: Chat[];
    filteredChats: Observable<Chat[]>;

    filteredOptions: Observable<any[]>;
    // options = new Observable<string[]>();
    get options() {
        const mesArray = this.userChats.slice().map(chat => chat.messages);
        return this.userChats.slice().map(chat => chat.user.name);
    }
    get selectIndex() {
        return this.navService.navTab;
    }
    set selectIndex(index: number) {
        this.navService.navTab = index;
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
    currentChat: Chat;
    /*
    get messages(): Observable<IMessage[]> {
        return this.chatService.messages;
    }
    */

    constructor(private authService: AuthService, private navService: NavigationService) {
        this.filteredOptions = this.searchControl.valueChanges.pipe(
            startWith(''),
            map(param => param ? this.filterOptions(param) : [])
        );
        this.filteredChats = this.searchControl.valueChanges.pipe(
            startWith(''),
            mergeMap(param => {
                if (param)
                    return fromPromise(this.filterChats(param));
                else return of(this.userChats);
            })
            // map(param => param ? this.filterChats(param) : this.userChats)
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
        this.authService.chats.subscribe(chats => this.userChats = chats);
        this.navService.getTab().subscribe(tab => {
            console.log(tab);
        });
    }

    filterOptions(param: string) {
        return this.options.filter(option => option.toLowerCase().indexOf(param.toLowerCase()) === 0).slice(0, 5);
    }
    filterChats(param: string): Promise<Chat[]> {
        this.searchBuf = 0;
        const tmpChats: Chat[] = this.userChats.slice();
        return tmpChats.map(us => us.loadMore()).reduce((p: Promise<Chat[]>, val, index) => {
            return p.then(hasVal => {
                // return val.loadMore(index);
                return val.then(messages => {
                    let findMessage = false;
                    messages.forEach(message => {
                        if (message.text.toLowerCase().indexOf(param.toLowerCase()) !== -1)
                            findMessage = true;
                    });
                    return findMessage;
                }).then(messageFound => {
                    if (tmpChats[index].user.name.toLowerCase().indexOf(param.toLowerCase()) === 0 || messageFound)
                        hasVal.push(tmpChats[index]);
                    this.searchBuf = (index + 2) / tmpChats.length * 100;
                    return hasVal;
                });
            });
        }, Promise.resolve([]));
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

    tabChat(chat: Chat) {
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
    }

    ngOnDestroy(): void {
        // should I unsubscribe?
        // actually I ned to set up the new message notif
        // TODO: new message notif
    }

}
