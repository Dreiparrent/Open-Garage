import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IImg, IUser, IUserData, CommunitySearchType } from '../../community/community-interfaces';
import { CommunityService } from '../../community/community.service';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-dialog-card',
  templateUrl: './user-dialog-card.component.html',
  styleUrls: ['./user-dialog-card.component.scss']
})
export class UserDialogCardComponent implements OnInit {

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

    @Input() profile: IUser;
    @Input() actions = false;
    @Input() highlight: string;
    get imgUrl() {
        return this.profile.imgUrl as IImg;
    }
    @Output() close = new EventEmitter<boolean>();
    @Output() connect = new EventEmitter<boolean>();
    showProfileFooter = environment.showProfileFooter;
    get selected() {
        if (this.comService.searchType.getValue() !== CommunitySearchType.members)
            return this.comService.searchSkills.getValue()[0];
        return '';
    }

    constructor(private comService: CommunityService, private authService: AuthService) {
        // this.imgUrl = this.profile.imgUrl as IImg;
    }

    ngOnInit() {
        this.authService.sharedCommunity(this.profile.ref).then(isShared => {
            if (isShared)
                this.userType = 1;
        }).then(() => {
            if (this.authService.token === this.profile.ref.id)
                this.userType = 2;
        });
        this.comService.setMembers({ founder: null, members: [this.profile.ref] }, false).then(users => {
            this.profile = users[0];
        });
    }

    skillSelect(skill: string) {
        // console.log('select', type);
        this.comService.updateSearch([], [skill], skill, CommunitySearchType.skills);
    }

    connectUser() {
        return true;
        // console.log('not yet completed');
    }

    onConnect() {
        this.connect.emit(true);
    }

    onClose() {
        this.close.emit(true);
    }
}
