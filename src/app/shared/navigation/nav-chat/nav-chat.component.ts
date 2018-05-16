import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { IProfile } from '../../community/community-interfaces';
import { IChat, ChatService, IMessage } from '../../community/chat.service';
import { Observable, } from 'rxjs';
import { MyErrorStateMatcher } from '../../../pages/register-page/ragister-validator';
import { startWith, map } from 'rxjs/operators';

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
    options: string[];
    selectIndex: number;
    messageName = '';

    searchBuf = 100;
    searchProg = 0;
    searchCol = 'primary';

    chatBuf = 0;
    chatProg = 100;
    chatCol = 'primary';

    @ViewChild('messageInput') messageInput: ElementRef<HTMLInputElement>;

    _messages: IMessage[];
    get messages(): Observable<IMessage[]> {
        return this.chat.getMessages();
    }

    constructor(private chat: ChatService) {
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
        this.chat.getChats().subscribe(chats => {
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
    }

    filterOptions(param: string) {
        return this.options.filter(option => option.toLowerCase().indexOf(param.toLowerCase()) === 0).slice(0, 5);
    }
    filterChats(param: string) {
        const chats = this.userChats.filter(chat => {
            let findMesage = false;
            const leng = chat.messages.length;
            for (let i = 0; i < leng; i++) {
                this.searchBuf = ((i + 1) / leng) * 100;
                if (chat.messages[i].text.toLowerCase().indexOf(param.toLowerCase()) !== -1)
                    findMesage = true;
            }
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

    tabChat() {
        this.messageName = this.userChats[0].user.name;
        this.selectIndex = 1;
        this.chat.setMessages();
    }

    tabMessage() {
        this.selectIndex = 0;
    }

    sendMessage(message: string) {
        console.log(message);
        this.chatProg = 0;
        const mesVal = message;
        this.messageInput.nativeElement.value = '';
        setTimeout(() => {
            this.chatBuf = 50;
        }, 1000);
        this.chat.sendMessage(message).then(success => {
            this.chatProg = 100;
            this.chatBuf = 0;
            if (success) {
                this.chatCol = 'primary';
                this.messageControl.updateValueAndValidity();
            } else {
                this.messageInput.nativeElement.value = mesVal;
                this.chatCol = 'warn';
                this.messageControl.updateValueAndValidity();
            }
        });
        // TODO: add the failure and progress;
    }

    ngOnDestroy(): void {
        // should I unsubscribe?
        // actually I ned to set up the new message notif
        // TODO: new message notif
    }

}
