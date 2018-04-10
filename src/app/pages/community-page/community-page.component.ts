import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { CommunityService } from '../../shared/community/community.service';
import { ActivatedRoute } from '@angular/router';
import { ICommunityData, IProfile } from '../../shared/community/community-interfaces';
import { Subscription } from 'rxjs/Subscription';
import { NavigationService } from '../../shared/navigation/navigation-service';

@Component({
    selector: 'app-community-page',
    templateUrl: './community-page.component.html',
    styleUrls: ['./community-page.component.scss']
})
export class CommunityPageComponent implements OnInit, OnDestroy {

    // Observerer
    private _queryListener: () => void;
    mobileQuery: MediaQueryList;
    medQuery: MediaQueryList;
    largeQuery: MediaQueryList;
    cardNumber = 0;
    // Community Data
    communityData: ICommunityData;
    hasMembers = false;
    showWebs = false;
    hasTops = false;
    hasMessages = false;
    // Memebr holders
    communityMembers: IProfile[] = [];
    tmpTop: IProfile[] = [];
    topMembers: IProfile[] = [];

    tmpCom: boolean;

    constructor(private comService: CommunityService, private route: ActivatedRoute,
        private navService: NavigationService, private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher) {
        this.createObservers();
    }

    toggleComNav() {
        console.log('click');
        this.navService.communitySender();
    }

    ngOnInit() {
        this.comService.currentCommunity = this.route.snapshot.params['id'];
        this.communityData = this.comService.getCommunityData();
        if (this.communityData.members.length > 0)
            this.sortMembers();
        if (this.communityData.messages.length > 0)
            this.getMessages();
    }

    sortMembers() {
        this.communityMembers = this.communityData.members.slice().sort((profile1, profile2) => {
            if (profile1.connections < profile2.connections)
                return 1;
            if (profile1.connections > profile2.connections)
                return -1;
            return 0;
        });
        this.tmpTop = this.communityMembers.slice(0, 8);
        this.sortTopMembers();
        this.hasMembers = true;
        if (this.topMembers[0].connections > 0)
            this.hasTops = true;
        this.communityMembers.sort((profile1, profile2) => {
            if (profile1.name > profile2.name)
                return 1;
            if (profile1.name < profile2.name)
                return -1;
            return 0;
        });
    }

    getMessages() {
        this.hasMessages = true;
    }

    /* ** Observers and sorting ** */
    createObservers() {
        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._queryListener = () => {
            this.changeDetectorRef.detectChanges();
            this.sortMembers();
        };
        this.medQuery = this.media.matchMedia('(min-width: 600px) and (max-width: 1024px)');
        this.largeQuery = this.media.matchMedia('(min-width: 1024px)');
        this.mobileQuery.addListener(this._queryListener);
        this.medQuery.addListener(this._queryListener);
        this.largeQuery.addListener(this._queryListener);
    }

    sortTopMembers() {
        this.cardNumber = this.getCardNumber();
        this.topMembers = this.tmpTop.slice(0, this.cardNumber);
        this.comService.makeSmall(this.cardNumber < 7);
    }

    getCardNumber(): number {
        if (this.mobileQuery.matches)
            return 3;
        if (this.medQuery.matches)
            return 6;
        if (this.largeQuery.matches)
            return 8;
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._queryListener);
        this.medQuery.removeListener(this._queryListener);
        this.largeQuery.removeListener(this._queryListener);
    }
}
