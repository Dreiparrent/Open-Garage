import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { YourProfileDialogComponent } from '../your-profile-dialog/your-profile-dialog.component';
import { IUser, IUserData } from '../../community/community-interfaces';
import { AuthService, IYourProfile, IUpdateProfile } from '../../auth/auth.service';
import { UpdateProfileDialogComponent } from '../update-profile-dialog/update-profile-dialog.component';

@Component({
    selector: 'app-your-profile-card',
    templateUrl: './your-profile-card.component.html',
    styleUrls: ['./your-profile-card.component.scss']
})
export class YourProfileCardComponent implements OnInit {

    profile: IUser;
    isProvide: boolean;
    updateProg = 100;
    updateBuf = 0;
    updateCol = 'primary';

    constructor(private dialog: MatDialog, private auth: AuthService) { }

    ngOnInit() {
        this.auth.getUser().then(user => {
            console.log(user);
            this.profile = user;
            this.isProvide = this.auth.userProvider.includes('password');
        });
    }

    openProfile() {
        const dialogRef = this.dialog.open(YourProfileDialogComponent, { data: this.profile });
        dialogRef.afterClosed().subscribe((result: [IUser, boolean]) => {
            if (result) {
                this.updateProg = 0;
                this.auth.updateProfileInfo(result).subscribe(progress => {
                    this.updateProg = progress;
                    if (progress === -1)
                        this.updateCol = 'warn';
                });
            }
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
                this.updateProg = 0;
                this.auth.updateProfileData(profUpdates).subscribe(progress => {
                    this.updateProg = progress;
                    if (progress === -1)
                        this.updateCol = 'warn';
                });
            }
        });
    }

    logout() {
        this.auth.logout().then(result => console.log('logout', result));
    }

}
