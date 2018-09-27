import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IUser } from '../../community/community-interfaces';

@Component({
  selector: 'app-mobile-messages-dialog',
  templateUrl: './mobile-messages-dialog.component.html',
  styleUrls: ['./mobile-messages-dialog.component.scss']
})
export class MobileMessagesDialogComponent implements OnInit {

    isMessage = false;

    constructor(public dialogRef: MatDialogRef<MobileMessagesDialogComponent>) { }

    ngOnInit() {
    }

}
