import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IUser, IUserData } from '../../community/community-interfaces';
import { CommunityService } from '../../community/community.service';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

    isDisabled = true;
    get about() {
        try {
            const ab = (this.profile.userData as IUserData).profile.about;
            return ab; // TODO: uhh fix this and also fix the popup size
        } catch {
            return null;
        }
    }

    connectTip = this.isDisabled ? 'This user is not in your community' : 'Click to send a message';

    constructor(public dialogRef: MatDialogRef<UserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public profile: IUser, private comService: CommunityService) { }

    ngOnInit() {
        this.comService.setMembers({ founder: null, members: [this.profile.ref] }, false).then(users => {
            this.profile = users[0];
        });
    }

    connectUser() {
        // console.log('not yet completed');
    }

}
