import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { MyErrorStateMatcher } from '../../../pages/register-page/ragister-validator';
import { startWith, map, mergeMap } from 'rxjs/operators';
import { NavigationService } from '../navigation-service';
import { Chat } from '../../community/chat';
import { AuthService } from '../../auth/auth.service';
import { MatDialog } from '@angular/material';
import { NewChatDialogComponent, INewChatDialog } from '../../cards/new-chat-dialog/new-chat-dialog.component';
import { environment } from '../../../../environments/environment.prod';

@Component({
    selector: 'app-nav-chat',
    templateUrl: './nav-chat.component.html',
    styleUrls: ['./nav-chat.component.scss']
})
export class NavChatComponent implements OnInit {

    searchControl: FormControl = new FormControl();

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

    constructor(private authService: AuthService, private navService: NavigationService, private dialog: MatDialog) {
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
        );
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
        chat.listen();
        this.currentChat = chat;
        if (chat.connection) {
            const dialogRef = this.dialog.open<NewChatDialogComponent, INewChatDialog>(NewChatDialogComponent, {
                data: {
                    user: chat.user,
                    chat: chat
                },
                disableClose: false,
                hasBackdrop: true,
                maxWidth: '65vw',
                maxHeight: '100vh',
                closeOnNavigation: true
            });
            dialogRef.afterClosed().subscribe(val => console.log(val));
        }
    }

    tabMessage() {
        this.selectIndex = 0;
        this.currentChat.unsubscribe();
    }

}
