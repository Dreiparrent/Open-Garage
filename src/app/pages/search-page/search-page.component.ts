import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ICommunity, IProfile, ICommunityData, IUser } from '../../shared/community/community-interfaces';
import { CommunitiesService, ISearch, SimpleFilter } from '../../shared/community/communities.service';
import { AlertService, Alerts, IAlert } from '../../shared/alerts/alert.service';
import { firestore } from 'firebase/app';
import { Observable, Subject } from 'rxjs';
import { MatInput, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDialogComponent } from '../../shared/cards/user-dialog/user-dialog.component';
import { AuthService } from '../../shared/auth/auth.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { CreateCommunityDialogComponent } from '../../shared/cards/create-community-dialog/create-community-dialog.component';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

    location: firestore.GeoPoint;
    isAuth = false;
    currentSearch: string;
    communities: ICommunity[];
    locationAlert: IAlert;
    authAlert: IAlert;
    searchControl: FormControl;
    filterResults;
    searchResults: Observable<any[]>;
    clickCounter = 0;
    clickClear: NodeJS.Timer;
    // fResults: Observable
    options = [
        {
            name: 'test1'
        },
        {
            name: 'test2'
        },
        {
            name: 'another'
        },
        {
            name: 'an other'
        }
    ];

    @ViewChild('searchInput') searchInput: ElementRef<MatInput>;
    /*
    communities: ICommunity[] = [
        {
            name: 'Test Community',
            desc: 'a short description about the community and such',
            img: {
                webp: '../../../assets/img/photos/eclipse.webp',
                jpf: '../../../assets/img/photos/eclipse.jpf',
                else: '../../../assets/img/photos/eclipse.jpg'
            },
            location: 'Denver',
            members: 8,
            link: 'testlink'
        },
        {
            name: 'Test Community',
            desc: 'a short description about the community and such',
            img: {
                webp: '../../../assets/img/photos/eclipse.webp',
                jpf: '../../../assets/img/photos/eclipse.jpf',
                else: '../../../assets/img/photos/eclipse.jpg'
            },
            location: 'Denver',
            members: 8,
            link: 'testlink'
        },
        {
            name: 'Test Community',
            desc: 'a short description about the community and such',
            img: {
                webp: '../../../assets/img/photos/eclipse.webp',
                jpf: '../../../assets/img/photos/eclipse.jpf',
                else: '../../../assets/img/photos/eclipse.jpg'
            },
            location: 'Denver',
            members: 8,
            link: 'testlink'
        }
    ];
    */

    constructor(private comsService: CommunitiesService,
        private alertService: AlertService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog) {
        // this.searchResults = comsService.getSearch();
        this.authService.isAuthenticated().subscribe(isAuth => {
            if (!isAuth)
                this.authAlert = this.alertService.addAlert(Alerts.loginForFull);
            else if (this.authAlert) {
                this.alertService.removeAlert(this.authAlert);
                if (this.currentSearch)
                    this.search(this.currentSearch);
            }
            this.isAuth = isAuth;
        });
    }

    ngOnInit() {
        /*
        this.fResults = this.fControl.valueChanges.pipe(
            startWith(''),
            map(val => this.)
        )
        */
        this.searchControl = new FormControl();
        this.searchControl.valueChanges.pipe(
            startWith(''),
            map(val => this.comsService.search(val, this.isAuth))
        ).subscribe();
        this.searchResults = this.comsService.getSearch().pipe();
        this.searchResults.subscribe(res => {
            console.log(res);
        });
        this.route.queryParams.subscribe(params => {
            if (params['search']) {
                const search = params['search'];
                this.search(search);
                this.searchInput.nativeElement.value = search;
            }
        });
        const watcher = navigator.geolocation.watchPosition(this.getPosition.bind(this), this.positionError.bind(this));
        setTimeout(() => {
            if (this.location === undefined)
                this.positionError({
                    code: 1,
                    message: '',
                    PERMISSION_DENIED: 1,
                    POSITION_UNAVAILABLE: 2,
                    TIMEOUT: 1500
                });
        }, 1000);
        /*
        this.comsService.locationSearch(12).then(com => {
            this.communities = com;
        }, err => console.log(err));
        */
    }

    getPosition(position: Position) {
        if (this.locationAlert)
            this.alertService.removeAlert(this.locationAlert);
        this.location = new firestore.GeoPoint(position.coords.latitude, position.coords.longitude);
        if (this.searchInput.nativeElement.value.length < 1)
            this.comsService.locationSearch(this.location, 1);
    }
    positionError(error: PositionError) {
        if (error.code === error.PERMISSION_DENIED)
            this.locationAlert = this.alertService.addAlert(Alerts.locationError);
    }

    search(search: string) {
        this.currentSearch = search;
        this.comsService.search(search, this.isAuth);
    }

    comClick(link: string) {
        this.router.navigate(['/community', link]);
    }

    userClick(profile: IUser) {
        const dialogRef = this.dialog.open(UserDialogComponent, {
            data: profile,
            maxWidth: '65vw',
            maxHeight: '100vh',
            closeOnNavigation: true
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result)
                console.log(result);
        });
        // here
    }

    createCommunity() {
        if (this.clickCounter === 10)
            this._createCommunity();
        this.clickCounter += 1;
        clearTimeout(this.clickClear);
        this.clickClear = setTimeout(() => {
            this.clickCounter = 0;
        }, 1000);
    }

    private _createCommunity() {
        const dialogRef = this.dialog.open(CreateCommunityDialogComponent, { data: 'test' }); 
    }

}
