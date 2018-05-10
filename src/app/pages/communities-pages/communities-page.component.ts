import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import 'snazzy-info-window/dist/snazzy-info-window.css';
import { AgmInfoWindow, AgmMap } from '@agm/core';
import { GoogleMap, LatLngLiteral } from '@agm/core/services/google-maps-types';
import { AgmSnazzyInfoWindow } from '@agm/snazzy-info-window';
import { NavigationService } from '../../shared/navigation/navigation-service';
import { MatExpansionPanel, MatAccordion } from '@angular/material';
import { CommunitiesService } from '../../shared/community/communities.service';
import { _coords_to_inavigate, INavigation } from '../../shared/community/community-interfaces';
import { ICommunity } from '../../shared/community/community-interfaces';

@Component({
    selector: 'app-communities-page',
    templateUrl: './communities-page.component.html',
    styleUrls: ['./communities-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CommunitiesPageComponent implements OnInit, OnDestroy {

    height = '300px';
    zoom: number;
    mapPins: IPin[];
    listPins: IPin[];
    lPin: IPin;
    mPin: IPin;
    moveMap = false;

    communities: ICommunity[];
    hyps: number[];

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    pins: IPin[] = [];


    constructor(private el: ElementRef,
        private cd: ChangeDetectorRef,
        private comsServive: CommunitiesService,
        private navService: NavigationService,
        private media: MediaMatcher) {
        this.mobileQuery = media.matchMedia(('(max-width: 576px)'));
        this._mobileQueryListener = () => {
            this.mobileQuierer();
            this.cd.detectChanges();
        };
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit() {
        this.height = window.innerHeight + 'px';
        this.mobileQuierer();
        this.mapPins = [];
        this.listPins = [];
        this.hyps = [];
        this.comsServive.locationSearch(10).then(com => {
            this.communities = com;
            this.communities.forEach(comm => {
                this.pins.push({
                    com: comm,
                    expanded: false,
                    open: false
                });
                this.mapPins.push({
                    com: comm,
                    expanded: false,
                    open: false
                });
                /*
                this.listPins.push({
                    com: comm,
                    expanded: false,
                    open: false
                });
                */
                this.hyps.push(comm.hyp);
            });
        }, err => console.error(err));
    }

    mapIn(pin: IPin) {
        let shouldMove = false;
        if (pin)
            shouldMove = this.listPins.findIndex(p => p.com === pin.com) === -1;
        setTimeout(() => {
            this.lPin = pin;
            this.moveMap = shouldMove;
        });
    }
    listIn(pin: IPin) {
        setTimeout(() => {
            this.mPin = pin;
        });
    }

    mobileQuierer() {
        this.height = window.innerHeight + 'px';
        if (this.mobileQuery.matches)
            this.zoom = 1;
        else
            this.zoom = 3;
    }

    centerChange(cent: INavigation) {
        const sorted = this.mapPins.slice().sort((a, b) => {
            // const ah = a.com.hyp - chyp;
            // const bh = b.com.hyp - chyp;
            a.expanded = false;
            const ah = Math.pow((a.com.nav.lat - cent.lat), 2) + Math.pow((a.com.nav.lng - cent.lng), 2);
            const bh = Math.pow((b.com.nav.lat - cent.lat), 2) + Math.pow((b.com.nav.lng - cent.lng), 2);
            if (ah < bh)
                return -1;
            if (ah > bh)
                return 1;
            return 0;
        });
        if (this.lPin)
            sorted.forEach(p => {
                if (p.com === this.lPin.com)
                    p.expanded = true;
            });
        setTimeout(() => {
            this.listPins = sorted.slice(0, 3);
        });
    }



    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}

export interface IPin {
    com: ICommunity;
    expanded: boolean;
    open: boolean;
}

/*pinOpen(pin: IPin, isPannel: boolean = false) {
    const location = this.pins.indexOf(pin);
    if (!this.awaiter)
        if (isPannel) {
            this.pins.forEach(p => p.open = false);
            this.pins[location].open = true;
        } else {
            this.awaiter = true;
            this.pins[location].open = true;
        }
    else this.awaiter = false;
    this.pins.forEach(p => p.expanded = false);
    this.pins[location].expanded = true;
    this.cd.detectChanges();
}*/
/* working-ish
pinOpen(pin: IPin) {
    const location = this.pins.indexOf(pin);
    this.pins.forEach(p => p.expanded = false);
    this.pins[location].expanded = true;
    if (!this.pins.slice(0, 2).includes(pin)) {
        this.navigation = {
            lat: (this.mainMap.zoom < 15) ? pin.com.nav.lat : this.navigation.lat,
            lng: pin.com.nav.lng
        };
        this.mainMap.triggerResize(true);
    }
}
*/