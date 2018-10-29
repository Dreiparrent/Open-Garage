import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../../node_modules/@angular/material';

@Component({
    selector: 'app-location-help-dialog',
    templateUrl: './location-help-dialog.component.html',
    styleUrls: ['./location-help-dialog.component.scss']
})
export class LocationHelpDialogComponent {

    refuseText = `you may browse without location services,
     but you will not be able to join communities until you have verified your location`;
    mustRefuse = false;
    reload = false;

    constructor(public dialogRef: MatDialogRef<LocationHelpDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public isRegister = false) {
        if (isRegister)
            this.refuseText = 'our registration process requires gps coordinates to make sure you have the best experience possible.';
        console.log('is register', isRegister);
    }

    changeRefuse() {
        this.mustRefuse = true;
    }

    onClose() {
        return {
            refused: this.mustRefuse,
            reload: false
        };
    }

    onReload() {
        return {
            refused: this.mustRefuse,
            reload: true
        };
    }
}
