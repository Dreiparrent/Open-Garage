import { Component, OnInit, OnDestroy, EventEmitter, Input } from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';
import { IUser } from '../../../shared/community/community-interfaces';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-community-sidenav',
    templateUrl: './community-sidenav.component.html',
    styleUrls: ['./community-sidenav.component.scss']
})
export class CommunitySidenavComponent implements OnInit, OnDestroy {

    members: IUser[];
    isSmall = false;
    comSub: Subscription;
    smallSub: Subscription;

    @Input('comnav') comnav: MatSidenav;

    constructor(private comService: CommunityService) { }

    ngOnInit() {
        this.comSub = this.comService.members.subscribe(members => this.sortMembers(members));
        this.smallSub = this.comService.isSmall().subscribe((isSmall: boolean) => {
            this.comnav.mode = isSmall ? 'push' : 'side';
            this.isSmall = isSmall;
        });
    }

    sortMembers(members: IUser[]): void {
        this.members = members.slice().sort((profile1, profile2) => {
            if (profile1.name > profile2.name)
                return 1;
            if (profile1.name < profile2.name)
                return -1;
            return 0;
        });
    }

    toggleNav() {
        this.comnav.toggle();
    }

    ngOnDestroy() {
        this.comSub.unsubscribe();
        this.smallSub.unsubscribe();
    }

}
