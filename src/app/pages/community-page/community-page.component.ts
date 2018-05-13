import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { CommunityService } from '../../shared/community/community.service';
import { ActivatedRoute } from '@angular/router';
import { ICommunityData, IProfile, CommunitySearchType } from '../../shared/community/community-interfaces';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../shared/navigation/navigation-service';

@Component({
    selector: 'app-community-page',
    templateUrl: './community-page.component.html',
    styleUrls: ['./community-page.component.scss']
})
export class CommunityPageComponent implements OnInit, OnDestroy {

    hasMessages = true;

    // TODO: remove or update this
    hovered = false;

    // new
    nameSub: Subscription;
    searchSub: Subscription;
    membersSub: Subscription;
    skillsSub: Subscription;
    communityName: string;
    showWebs = false;
    tmpCom: boolean;
    searchValue: string;
    searchType: string;
    searchMembers = false;
    searchSkills = false;

    constructor(private comService: CommunityService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.nameSub = this.comService.init(this.route.snapshot.params['id']).subscribe(name => {
            this.communityName = name;
        });
        this.searchSub = this.comService.searchValue.subscribe(val => {
            this.searchValue = val;
            switch (this.comService.searchType.getValue()) {
                case -1:
                    this.searchType = null;
                    break;
                case CommunitySearchType.skills:
                    this.searchType = 'Skills';
                    break;
                case CommunitySearchType.members:
                    this.searchType = 'Members';
                    break;
                case CommunitySearchType.skillsSkills:
                    this.searchType = 'Community Skills > Skills';
                    break;
                case CommunitySearchType.skillsMembers:
                    this.searchType = 'Community Skills > Members';
                    break;
                case CommunitySearchType.messageMembers:
                    this.searchType = 'Message Board > Members';
                    break;
            }
            this.searchMembers = this.comService.searchMembers.getValue().length > 0;
            this.searchSkills = this.comService.searchSkills.getValue().length > 0;
        });
    }

    getMessages() {
        this.hasMessages = true;
    }

    toggleShowWebs(show: boolean) {
        this.showWebs = show;
    }

    clearSearch() {
        this.comService.updateSearch();
    }

    ngOnDestroy(): void {
        this.nameSub.unsubscribe();
        this.searchSub.unsubscribe();
    }
}
