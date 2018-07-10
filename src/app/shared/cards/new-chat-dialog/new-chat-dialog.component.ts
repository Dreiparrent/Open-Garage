import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { IUser } from '../../community/community-interfaces';
import { Chat } from '../../community/chat';

@Component({
    selector: 'app-new-chat-dialog',
    templateUrl: './new-chat-dialog.component.html',
    styleUrls: ['./new-chat-dialog.component.scss']
})
export class NewChatDialogComponent implements OnInit {

    @ViewChild('chatSubject') chatSubject: ElementRef<MatInput>;
    subject: string;

    constructor(public dialogRef: MatDialogRef<NewChatDialogComponent, INewChatDialog>,
        @Inject(MAT_DIALOG_DATA) public chatData: INewChatDialog) {
        console.log(this.chatData.chat.subject);
        if (this.chatData.chat)
            this.subject = this.chatData.chat.subject;
    }

    ngOnInit() {
    }
}

export interface INewChatDialog {
    user: IUser;
    chat?: Chat;
}