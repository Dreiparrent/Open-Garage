import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';

@Component({
    selector: 'app-new-chat-dialog',
    templateUrl: './new-chat-dialog.component.html',
    styleUrls: ['./new-chat-dialog.component.scss']
})
export class NewChatDialogComponent implements OnInit {

    @ViewChild('chatSubject') chatSubject: ElementRef<MatInput>;

    constructor(public dialogRef: MatDialogRef<NewChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public chatData: string) {

    }

    ngOnInit() {
    }
}
