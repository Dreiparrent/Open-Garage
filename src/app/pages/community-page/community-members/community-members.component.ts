import {
    Component, OnInit, OnDestroy, ChangeDetectorRef, Input,
    Output, EventEmitter, ViewChild, ElementRef, HostListener
} from '@angular/core';
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
    @ViewChild('viewMore') viewMore: ElementRef<HTMLElement>;
    scrollMore = false;
    viewLess = false;
    winHeight: number;
    vmHeight: number;

    // Observerer
    private _queryListener: () => void;
    mobileQuery: MediaQueryList;
    medQuery: MediaQueryList;
    largeQuery: MediaQueryList;
    cardNumber = 0;
    cardMultiplier = 1;
    multipleCardNumber = 0;
    membersSub: Subscription;
    searchSub: Subscription;
    // Community Data
    hasMembers = false;
    hasTops = false;
    hasMessages = false;
    // Memebr holders
    tmpMembers: IProfile[] = [];
    communityMembers: IProfile[] = [];
    topMembers: IProfile[] = [];

    constructor(private cd: ChangeDetectorRef,
        private comService: CommunityService, private navService: NavigationService,
        private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher) {
        this.createObservers();
    }

    ngOnInit() {
        this.onResize();
        this.membersSub = this.comService.members.subscribe(members => {
            this.tmpMembers = members.slice();
            this.communityMembers = members.slice();
            if (members.length > 0)
                this.sortMembers();
        });
        this.searchSub = this.comService.searchMembers.subscribe(members => {
            this.searchMembers(members);
        });
    }

    toggleViewMore() {
        if (this.viewLess) {
            this.cardMultiplier = 0;
            this.onScroll();
            this.scrollMore = true;
            return;
        } else if (!this.scrollMore) {
            this.vmHeight = $(this.viewMore.nativeElement).height();
            this.onScroll();
        }
        this.scrollMore = !this.scrollMore;
        // console.log('more', this.cardMartiplier);
    }
    onScroll() {
        this.cardMultiplier += 1;
        this.sortMembers();
    }
    /*
    toggleComNav() {
        this.navService.communitySender();
    }
    */

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
        this.sortTopMembers(this.communityMembers.slice(0, 8 * this.cardMultiplier));
        this.hasMembers = true;
        // TODO: sort out when no connections exist;
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
        this.multipleCardNumber = this.cardNumber * this.cardMultiplier;
        if (tmpTop.length <= this.multipleCardNumber) {
            this.multipleCardNumber = tmpTop.length;
            if (this.cardMultiplier > 1)
                this.viewLess = true;
        } else this.viewLess = false;
        this.topMembers = tmpTop.slice(0, this.multipleCardNumber);
        this.comService.makeSmall(this.multipleCardNumber < 7);
    }
    getCardNumber(): number {
        if (this.mobileQuery.matches)
            return 3;
        if (this.medQuery.matches)
            return 6;
        if (this.largeQuery.matches)
            return 8;
    }

    searchMembers(members: string[]) {
        if (members.length > 0) {
            this.communityMembers = [];
            members.forEach(member => {
                this.communityMembers = this.communityMembers.concat(this.tmpMembers.filter(m => m.name === member));
            });
            this.sortMembers();
        } else {
            this.communityMembers = this.tmpMembers;
            this.sortMembers();
        }
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._queryListener);
        this.medQuery.removeListener(this._queryListener);
        this.largeQuery.removeListener(this._queryListener);
        this.membersSub.unsubscribe();
        this.searchSub.unsubscribe();
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (this.scrollMore) {
            const winScroll = $(window).scrollTop();
            const parHeight = $(this.viewMore.nativeElement.parentElement.parentElement.parentElement.parentElement).position().top;
            const elemPos = $(this.viewMore.nativeElement).position().top;
            if (winScroll - parHeight - elemPos + this.winHeight)
                // this.scrollMore = false;
                setTimeout(() => {
                    // this.scrollMore = !this.scrollMore;
                    if (this.scrollMore && !this.viewLess)
                        this.onScroll();
                }, 2000);
            // console.log('scroll', winScroll - parHeight - elemPos + this.winHeight);
        }
    }
    @HostListener('window:resize', [])
    onResize() {
        this.winHeight = $(window).height();
    }
}
