import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ICommunity, IProfile, ICommunityData, IUser } from '../../shared/community/community-interfaces';
import { CommunitiesService, ISearch } from '../../shared/community/communities.service';
import { AlertService, Alerts, IAlert } from '../../shared/alerts/alert.service';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import { MatInput, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { UserDialogComponent } from '../../shared/cards/user-dialog/user-dialog.component';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

    location: firestore.GeoPoint;
    communities: ICommunity[];
    currentAlert: IAlert;
    searchResults;
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
        private router: Router,
        private dialog: MatDialog) {
        this.searchResults = comsService.getSearch();
    }

    ngOnInit() {
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
        if (this.currentAlert)
            this.alertService.removeAlert(this.currentAlert);
        this.location = new firestore.GeoPoint(position.coords.latitude, position.coords.longitude);
        if (this.searchInput.nativeElement.value.length < 1)
            this.comsService.locationSearch(this.location, 1);
    }
    positionError(error: PositionError) {
        if (error.code === error.PERMISSION_DENIED)
            this.currentAlert = this.alertService.addAlert(Alerts.locationError);
    }

    search(search: string) {
        console.log(search);
        this.comsService.search(search);
    }

    comClick(link: string) {
        this.router.navigate(['/community', link]);
    }

    userClick(profile: IUser) {
        const dialogRef = this.dialog.open(UserDialogComponent, { data: profile });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result)
                console.log(result);
        });
        // here
    }

}
