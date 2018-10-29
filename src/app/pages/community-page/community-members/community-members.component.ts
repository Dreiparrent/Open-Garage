import {
    Component, OnInit, OnDestroy, ChangeDetectorRef, Input,
    Output, EventEmitter, ViewChild, ElementRef, HostListener
} from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';
import { IProfile, CommunitySearchType, IUser } from '../../../shared/community/community-interfaces';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavigationService } from '../../../shared/navigation/navigation-service';
import { Subscription } from 'rxjs';
import { UserDialogComponent } from '../../../shared/cards/user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../../shared/auth/auth.service';
import { ChatService } from '../../../shared/community/chat.service';
import { NewChatDialogComponent, INewChatDialog } from '../../../shared/cards/new-chat-dialog/new-chat-dialog.component';
import { Chat } from '../../../shared/community/chat';
import { AngularFirestore } from 'angularfire2/firestore';

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
    isMember = false;

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
    tmpMembers: IUser[] = [];
    communityMembers: IUser[] = [];
    topMembers: IUser[] = [];
    clickIndex = -1;
    showOverlay = true;
    get showSingle() {
        return this.comService.searchType.getValue() === CommunitySearchType.skills;
    }

    constructor(private dialog: MatDialog, private authService: AuthService,
        private comService: CommunityService, private db: AngularFirestore, private navService: NavigationService,
        private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher) {
        comService.members.subscribe(members => {
            if (members.filter(user => user.ref.id === this.authService.token).length > 0)
                this.isMember = true;
        });
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
            if (this.tmpMembers.length > 0)
                this.searchMembers(members);
        });
    }

    toggleViewMore() {
        this.scrollMore = !this.scrollMore;
        if (this.viewLess) {
            this.cardMultiplier = 0;
            this.onScroll();
            this.scrollMore = false;
        } else if (this.scrollMore) {
            this.vmHeight = $(this.viewMore.nativeElement).height();
            this.onScroll();
        }
    }
    toggleViewLess() {
        this.cardMultiplier = 0;
        this.onScroll();
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

    sortTopMembers(tmpTop: IUser[]) {
        this.cardNumber = this.getCardNumber();
        this.multipleCardNumber = this.cardNumber * this.cardMultiplier;
        if (tmpTop.length < this.multipleCardNumber) {
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

    cardClick(index: number, profile: IUser) {
        this.comService.updateSearch([], profile.skills, profile.name, CommunitySearchType.members);
        /*
        // console.log($(`#card-${index}`).children[0].children[0]);
        if (this.clickIndex === index) {
            const dialogRef = this.dialog.open(UserDialogComponent, {
                data: profile,
                maxWidth: '65vw',
                maxHeight: '100vh',
                closeOnNavigation: true
            });
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result) {
                    const newChatRef = this.dialog.open<NewChatDialogComponent, INewChatDialog>(NewChatDialogComponent, {
                        maxWidth: '65vw',
                        maxHeight: '100vh',
                        data: {
                            user: profile
                        }
                    });
                    newChatRef.afterClosed().subscribe((chatSubject: string) => {
                        Chat.startNewChat(this.db, this.authService, this.comService, profile, chatSubject)
                            .then(() => {
                                this.navService.isOpen = true;
                                this.navService.navTab = 1;
                            });
                        // this.chatService.startNewChat(profile, chatSubject);
                    });
                }
                /*
                if (result)
                    this.chatService.startNewChat(profile);
                    */
        /*
            });
        }
        this.clickIndex = index;
        // profile.userClick = true;
        if (this.comService.searchType.getValue() !== CommunitySearchType.topSkills)
            this.comService.updateSearch([profile.name], profile.skills, profile.name, CommunitySearchType.communityMember);
        */
    }

    searchMembers(members: string[]) {
        if (members.length > 0) {
            this.communityMembers = [];
            const sMembers = this.comService.clickMember.getValue();
            sMembers.forEach(s => {
                this.communityMembers = this.communityMembers.concat(this.tmpMembers.filter(m => {
                    return m.name === s.name && m.skills === s.skills;
                }));
            });
            // this.communityMembers = this.communityMembers.filter(m => sMembers)
            // this.comService.clickMember.getValue().forEach(m => {
            // })
            /*
            members.forEach(member => {
                this.communityMembers = this.communityMembers.concat(this.tmpMembers.filter(m => {
                    return m.name === member && this.communityMembers.filter(user => user.name === m.name).length < 1;
                }));
            });
            this.showOverlay = true;
            */
        } else {
            this.communityMembers = this.tmpMembers;
            this.showOverlay = false;
        }
        this.sortMembers();
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
                if (!this.viewLess)
                    setTimeout(() => {
                        if (this.scrollMore)
                            this.onScroll();
                    }, 2000);
        }
    }
    @HostListener('window:resize', [])
    onResize() {
        this.winHeight = $(window).height();
    }
}
