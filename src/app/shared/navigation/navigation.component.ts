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

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, AfterViewInit {

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
    communityLinks: Observable<ICommunity[]>;
    navSubscribe: Subscription;
    comSubscribe: Subscription;

    constructor(private navService: NavigationService, private authService: AuthService) {
        this.navService.navProfile.subscribe(prof => {
            if (prof) {
                this.navLinks = authLinks;
                this.isAuth = prof.auth;
                /*
                $('.mat-tab-label').click(() => {
                    console.log('change', this.isMessage);
                    if (!!this.selectIndex !== (this.prevIndex === 1))
                        this.isMessage = false;
                    console.log('change', this.isMessage);
                    this.prevIndex = this.selectIndex;
                });
                */
            } else
                this.navLinks = noAuthLinks;
        });
        this.communityLinks = this.authService.communities;
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
        /*
        this.sidenav.openedChange.subscribe((m: boolean) => {
            this.navService.toggle(m);
        });
        */
        // closedStart | onPositionChanged | openedStart
    }

    ngAfterViewInit() {

    }

    trackByIndex(index: number, value: number) {
        return index;
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