import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IUser } from '../../community/community-interfaces';

@Component({
  selector: 'app-mobile-profile-dialog',
  templateUrl: './mobile-profile-dialog.component.html',
  styleUrls: ['./mobile-profile-dialog.component.scss']
})
export class MobileProfileDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<MobileProfileDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public profile: IUser) { }

    ngOnInit() {
    }

}
