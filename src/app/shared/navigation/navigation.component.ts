import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import { NavigationService } from './navigation-service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../auth/auth.service';
import { ICommunity, ICommunityData } from '../community/community-interfaces';
import { CommunityService } from '../community/community.service';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable, Subscription, of, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

    @Input('sidenav') sidenav: MatSidenav;
    isAuth: boolean;
    navLinks: INavLinks[];
    /*
    get navLinks() {
        return this._navLinks.asObservable();
    }
    */
    // communityLinks: string[];
    communityLinks: Observable<ICommunity[]>;
    navSubscribe: Subscription;
    comSubscribe: Subscription;

    constructor(private navService: NavigationService, private authService: AuthService, private comService: CommunityService) {
        this.navService.navProfile.subscribe(prof => {
            if (prof) {
                this.navLinks = authLinks;
                this.isAuth = prof.auth;
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