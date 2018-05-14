import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { YourProfileDialogComponent } from '../your-profile-dialog/your-profile-dialog.component';
import { IProfile } from '../../community/community-interfaces';
import { AuthService, IYourProfile, IUpdateProfile } from '../../auth/auth.service';
import { UpdateProfileDialogComponent } from '../update-profile-dialog/update-profile-dialog.component';

@Component({
    selector: 'app-your-profile-card',
    templateUrl: './your-profile-card.component.html',
    styleUrls: ['./your-profile-card.component.scss']
})
export class YourProfileCardComponent implements OnInit {

    profile: IProfile;

    constructor(private dialog: MatDialog, private auth: AuthService) { }

    ngOnInit() {
        this.profile = this.auth.getUser();
    }

    openProfile() {
        const dialogRef = this.dialog.open(YourProfileDialogComponent, { data: this.profile });
        dialogRef.afterClosed().subscribe((result: IYourProfile) => {
            if (result)
                this.auth.updateProfileInfo(result);
        });
    }
    openUpdate() {
        const dialogRef = this.dialog.open(UpdateProfileDialogComponent, { data: this.profile });
        dialogRef.afterClosed().subscribe((result: IUpdateProfile) => {
            if (result) {
                const profUpdates: IUpdateProfile = {
                    email: result.email
                };
                if (result.pass1 && result.pass2)
                    if (result.pass1 === result.pass2)
                        profUpdates.pass = result.pass1;
                this.auth.updateProfileData(profUpdates);
            }
        });
    }

}
