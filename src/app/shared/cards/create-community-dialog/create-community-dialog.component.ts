import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-create-community-dialog',
  templateUrl: './create-community-dialog.component.html',
  styleUrls: ['./create-community-dialog.component.scss']
})
export class CreateCommunityDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<CreateCommunityDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
