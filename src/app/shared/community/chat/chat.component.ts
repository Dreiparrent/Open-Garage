import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../pages/register-page/ragister-validator';
import { Chat } from '../chat';
import { Subscription, interval } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    // tslint:disable-next-line:no-input-rename
    @Input('currentChat') currentChat: Chat;
    @Input('isLarge') isLarge = false;
    @Output('userClick') userClick = new EventEmitter<string>();

    messageControl: FormControl = new FormControl('', [() => this.messageErrors()]);
    matcher = new MyErrorStateMatcher();
    @ViewChild('messageInput') messageInput: ElementRef<HTMLInputElement>;

    chatBuf = 100;
    chatProg = 100;
    chatCol: 'primary' | 'accent' | 'warn' = 'primary';
    // currentChat: Chat;

    messageErrors(): { [key: string]: boolean } {
        if (this.chatCol === 'warn')
            return { messageSend: true };
        else
            return null;
    }

    constructor() { }

    ngOnInit() {
    }

    nameClick(name: string) {
        this.userClick.next(name);
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

}
