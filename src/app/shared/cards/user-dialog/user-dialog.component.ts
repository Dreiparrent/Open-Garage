import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IUser, IUserData } from '../../community/community-interfaces';
import { CommunityService } from '../../community/community.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

    connectTip = 'This user is not in your community';
    private _userType = 0;
    set userType(uType: number) {
        switch (uType) {
            case 2:
                this.connectTip = 'This is your profile';
                break;
            case 1:
                this.connectTip = 'Click to send a message';
                break;
            default:
                this.connectTip = 'This user is not in your community';
                break;
        }
        this._userType = uType;
    }
    get userType() {
        return this._userType;
    }
    get about() {
        try {
            const ab = (this.profile.userData as IUserData).profile.about;
            return ab; // TODO: uhh fix this and also fix the popup size (it's massive in full screen and unable to close)
        // also add a slower loader for "Join Community" button
        } catch {
            return null;
        }
    }

    constructor(public dialogRef: MatDialogRef<UserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public profile: IUser, private comService: CommunityService,
        private authService: AuthService) {
        this.authService.sharedCommunity(this.profile.ref).then(isShared => {
            if (isShared)
                this.userType = 1;
        }).then(() => {
            if (this.authService.token === this.profile.ref.id)
                this.userType = 2;
        });
    }

    ngOnInit() {
        this.comService.setMembers({ founder: null, members: [this.profile.ref] }, false).then(users => {
            this.profile = users[0];
        });
    }

    connectUser() {
        // console.log('not yet completed');
    }

}
