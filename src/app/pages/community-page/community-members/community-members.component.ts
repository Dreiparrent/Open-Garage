import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';
import { IProfile } from '../../../shared/community/community-interfaces';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavigationService } from '../../../shared/navigation/navigation-service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-community-members',
    templateUrl: './community-members.component.html',
    styleUrls: ['./community-members.component.scss']
})
export class CommunityMembersComponent implements OnInit, OnDestroy {

    @Output() showWebs = new EventEmitter<boolean>();

    // Observerer
    private _queryListener: () => void;
    mobileQuery: MediaQueryList;
    medQuery: MediaQueryList;
    largeQuery: MediaQueryList;
    cardNumber = 0;
    membersSub: Subscription;
    // Community Data
    hasMembers = false;
    hasTops = false;
    hasMessages = false;
    // Memebr holders
    communityMembers: IProfile[] = [];
    topMembers: IProfile[] = [];

    constructor(private comService: CommunityService, private navService: NavigationService,
        private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher) {
        this.createObservers();
    }

    ngOnInit() {
        this.membersSub = this.comService.members.subscribe(members => {
            this.communityMembers = members.slice();
            if (members.length > 0)
                this.sortMembers();
        });
    }

    toggleComNav() {
        this.navService.communitySender();
    }

    activateWebs(checked: boolean) {
        console.log('webs', checked);
    }

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

    sortMembers() {
        this.communityMembers.sort((profile1, profile2) => {
            if (profile1.connections < profile2.connections)
                return 1;
            if (profile1.connections > profile2.connections)
                return -1;
            return 0;
        });
        this.sortTopMembers(this.communityMembers.slice(0, 8));
        this.hasMembers = true;
        if (this.topMembers[0].connections > 0)
            this.hasTops = true;
        if (this.topMembers.length > 3)
            this.showWebs.emit(this.hasTops);
        else
            this.showWebs.emit(false);
            // this.comService.showWeb = this.hasTops;
    }

    sortTopMembers(tmpTop: IProfile[]) {
        this.cardNumber = this.getCardNumber();
        this.topMembers = tmpTop.slice(0, this.cardNumber);
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
        this.membersSub.unsubscribe();
    }
}
