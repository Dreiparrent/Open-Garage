import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, EventEmitter, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { NavigationService } from './navigation-service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../auth/auth.service';
import { ICommunity, ICommunityData } from '../community/community-interfaces';
import { CommunityService } from '../community/community.service';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable, Subscription, of, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatService } from '../community/chat.service';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { MobileProfileDialogComponent } from '../cards/mobile-profile-dialog/mobile-profile-dialog.component';
import { MobileMessagesDialogComponent } from '../cards/mobile-messages-dialog/mobile-messages-dialog.component';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

    @Input('sidenav') sidenav: MatSidenav;
    isAuth: boolean;
    navLinks: INavLinks[];
    prevIndex = 0;
    get selectIndex() {
        return this.navService.currentTab;
    }
    set selectIndex(index: number) {
        this.navService.currentTab = index;
    }
    isMessage = false;
    /*
    get navLinks() {
        return this._navLinks.asObservable();
    }
    */
    // communityLinks: string[];
    get communityLinks(): Observable<ICommunity[]> {
        return this.authService.communities;
    }
    navSubscribe: Subscription;
    comSubscribe: Subscription;

    constructor(private navService: NavigationService, private authService: AuthService, private dialog: MatDialog) {
        this.navService.navProfile.subscribe(prof => {
            if (prof) {
                this.navLinks = authLinks;
                this.isAuth = prof.auth;
            } else
                this.navLinks = noAuthLinks;
        });
    }

    ngOnInit() {
        this.navSubscribe = this.navService.listen().subscribe((m: boolean) => {
            if (m)
                this.sidenav.open();
            else this.sidenav.close();
        });
        this.sidenav.position = 'end'; // remove to make start
        this.sidenav.mode = 'over'; // over | push | side
        this.sidenav.fixedInViewport = true;
    }

    trackByIndex(index: number, value: number) {
        return index;
    }

    openProfile() {
        const dialogRef = this.dialog.open(MobileProfileDialogComponent, {
            data: this.authService.currentUser,
            hasBackdrop: true,
            disableClose: false });
    }
    openMessages() {
        const dialogRef = this.dialog.open(MobileMessagesDialogComponent, {
            width: '100%',
            height: '100%'
        });
    }
}
interface INavLinks {
    display: string;
    link: string;
}
const noAuthLinks: INavLinks[] = [
    {
        display: 'Home',
        link: '/home'
    },
    {
        display: 'Login',
        link: '/login'
    },
    {
        display: 'Register',
        link: '/register'
    },
    {
        display: 'Search',
        link: '/search'
    }
];
const authLinks: INavLinks[] = [
    {
        display: 'Home',
        link: '/home'
    },
    {
        display: 'Search',
        link: '/search'
    }
];