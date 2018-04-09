import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import { NavigationService } from './navigation-service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../auth/auth.service';
import { ICommunity } from '../community/community-interfaces';
import { CommunityService } from '../community/community.service';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

    @Input('sidenav') sidenav: MatSidenav;
    @ViewChild('testToggle') testToggle: MatSlideToggle;
    // openChange: EventEmitter<boolean>;
    isAuth: boolean;
    navLinks: INavLinks[];
    communityLinks: ICommunity[];

    constructor(private navService: NavigationService, private authService: AuthService, private comService: CommunityService) {
        this.navService.listen().subscribe((m: any) => {
            console.log('toggled', m);
        });
    }

    ngOnInit() {
        this.sidenav.position = 'end'; // remove to make start
        this.sidenav.mode = 'over'; // over | push | slide
        this.sidenav.fixedInViewport = true;
        this.sidenav.openedChange.subscribe((m: boolean) => {
            this.navService.toggle(m);
        });
        // closedStart | onPositionChanged | openedStart

        this.isAuth = this.authService.isAuthenticated();
        this.navLinks = (this.isAuth) ? authLinks : noAuthLinks;
        if (this.isAuth)
            this.communityLinks = this.comService.getCommunities('testID');

        // TODO: Remove this
        this.navLinks = noAuthLinks;
        /*
        this.testToggle.change.subscribe((m: MatSlideToggleChange) => {
            this.toggleLogin(m);
        });
        */
        $('.testclass').focusout();
    }

    toggleLogin(m: MatSlideToggleChange) {
        if (m.checked) {
            this.isAuth = true;
            this.communityLinks = this.comService.getCommunities('testID');
            this.navLinks = authLinks;
        } else {
            this.isAuth = false;
            this.communityLinks = [];
            this.navLinks = noAuthLinks;
        }
    }
    trackByIndex(index: number, value: number) {
        return index;
    }

    ngOnDestroy(): void {
        this.sidenav.openedChange.unsubscribe();
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
        display: 'Search',
        link: '/search'
    }
];