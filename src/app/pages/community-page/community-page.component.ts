import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { CommunityService } from '../../shared/community/community.service';
import { ActivatedRoute } from '@angular/router';
import { ICommunityData, IProfile } from '../../shared/community/community-interfaces';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../shared/navigation/navigation-service';

@Component({
    selector: 'app-community-page',
    templateUrl: './community-page.component.html',
    styleUrls: ['./community-page.component.scss']
})
export class CommunityPageComponent implements OnInit, OnDestroy {

    hasMessages = false;

    // new
    nameSub: Subscription;
    communityName: string;
    showWebs = false;
    tmpCom: boolean;

    constructor(private comService: CommunityService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.nameSub = this.comService.init(this.route.snapshot.params['id']).subscribe(name => {
            this.communityName = name;
        });
    }

    getMessages() {
        this.hasMessages = true;
    }

    ngOnDestroy(): void {
        this.nameSub.unsubscribe();
    }
    toggleShowWebs(show: boolean) {
        this.showWebs = show;
    }
}
