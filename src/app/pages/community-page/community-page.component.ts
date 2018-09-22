import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { CommunityService } from '../../shared/community/community.service';
import { ActivatedRoute } from '@angular/router';
import { ICommunityData, IProfile, CommunitySearchType, IUser } from '../../shared/community/community-interfaces';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../shared/navigation/navigation-service';
import { AuthService } from '../../shared/auth/auth.service';
import { AlertService, Alerts } from '../../shared/alerts/alert.service';
import { Chat } from '../../shared/community/chat';

@Component({
    selector: 'app-community-page',
    templateUrl: './community-page.component.html',
    styleUrls: ['./community-page.component.scss']
})
export class CommunityPageComponent implements OnInit, OnDestroy {

    hasMessages = true;

    // TODO: remove or update this
    comID: string;
    hovered = false;
    isAuth = false;
    isMember = false;
    currentChat: Chat;

    // new
    _nameSub: Subscription;
    _searchSub: Subscription;
    _membersSub: Subscription;
    _messageSub: Subscription;
    skillsSub: Subscription;
    communityName: string;
    showWebs = false;
    tmpCom: boolean;
    searchValue: string;
    searchType: string;
    searchMembers = false;
    searchSkills = false;

    constructor(private comService: CommunityService, private authService: AuthService,
        private route: ActivatedRoute, private alertService: AlertService) {
       this._membersSub = comService.members.subscribe(members => {
            if (members.filter(user => user.ref.id === this.authService.token).length > 0)
                this.isMember = true;
        });
        this._messageSub = comService.messageRef.subscribe(ref => {
            if (ref)
                this.authService.getChat(ref).then(chat => {
                    if (chat) {
                        chat.listen();
                        this.currentChat = chat;
                    }
                });
        });
        authService.isAuthenticated().subscribe(auth => this.isAuth = auth);
    }

    ngOnInit() {
        this.comID = this.route.snapshot.params['id'];
        this._nameSub = this.comService.init(this.comID).subscribe(name => {
            this.communityName = name;
        });
        this._searchSub = this.comService.searchValue.subscribe(val => {
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
                case CommunitySearchType.topSkills:
                    this.searchType = 'Top Skills';
                    break;
                case CommunitySearchType.communityMember:
                    this.searchType = 'Community Member';
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

    chatClick(name: string) {
        console.log(name);
        const comMembers = this.comService.getMembers('').filter(memb => memb.name === name);
        this.comService.updateSearch([name], [], name,  CommunitySearchType.messageMembers);
    }

    joinCommunity() {
        if (this.authService.isAuth)
            this.comService.joinCommunity(this.authService.token).then(result => {
                if (result)
                    this.alertService.addAlert(Alerts.comJoinSuccess);
            });
        else this.alertService.addAlert(Alerts.loginForFull);
    }

    ngOnDestroy(): void {
        this._nameSub.unsubscribe();
        this._searchSub.unsubscribe();
        this._membersSub.unsubscribe();
        this._messageSub.unsubscribe();
        if (this.currentChat)
            this.currentChat.unsubscribe();
    }
}
