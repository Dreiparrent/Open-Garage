import { Component, OnInit, OnDestroy, EventEmitter, Input } from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';
import { IProfile } from '../../../shared/community/community-interfaces';
import { Subscription } from 'rxjs/Subscription';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-community-sidenav',
    templateUrl: './community-sidenav.component.html',
    styleUrls: ['./community-sidenav.component.scss']
})
export class CommunitySidenavComponent implements OnInit, OnDestroy {

    members: IProfile[];
    isSmall = false;
    comSub: Subscription;
    smallSub: Subscription;

    @Input('comnav') comnav: MatSidenav;

    constructor(private comService: CommunityService) { }

    ngOnInit() {
        this.comSub = this.comService.members.subscribe((members: IProfile[]) => {
            this.members = members;
        });
        this.smallSub = this.comService.isSmall().subscribe((isSmall: boolean) => {
            this.comnav.mode = isSmall ? 'push' : 'side';
            this.isSmall = isSmall;
        });
        // console.log(this.comService.currnetCommunity.getValue());
        // this.members = this.comService.members;
        // console.log(this.members);
    }

    toggleNav() {
        this.comnav.toggle();
    }

    ngOnDestroy() {
        this.comSub.unsubscribe();
    }

}
