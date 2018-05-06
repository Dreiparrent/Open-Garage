import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { animate, trigger, transition, state, style } from '@angular/animations';
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
    animations: [
        trigger('aAccordion', [
            state('showing', style({ left: '0' })),
            state('hidden', style({ left: '-100%'})),
            transition('showing => hidden', animate('250ms ease-out')),
            transition('hidden => showing', animate('250ms ease-in'))
        ]),
        trigger('aArrow', [
            state('showing', style({ transform: 'rotate(0deg)'})),
            state('hidden', style({ transform: 'rotate(180deg)' })),
            transition('shoing => hidden', animate('1.0s 250ms ease-out')),
            transition('hidden => shoing', animate('1.0s 250ms ease-in'))
        ])
    ]
})
export class CommunitiesPageComponent implements OnInit, OnDestroy {

    navigation: INavigation = { lat: undefined, lng: undefined };
    errorCords: INavigation = { lat: 39.682380, lng: -104.964384 };
    height = '300px';
    comIcon = 'assets/icons/ic_com_pin@2x.png';
    hasError = false;
    errorContent: string;
    awaiter = false;
    communities: ICommunity[];
    maxCards = 1;
    hyps: number[];

    aState = 'showing';

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    expOpen: (pin: IPin) => void;

    @ViewChild('mainMap') mainMap: AgmMap;
    @ViewChild('errorWindow') errorWindow: AgmInfoWindow;
    @ViewChild('pannels') pannels: MatAccordion;

    pins: IPin[];

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
        this.mobileQuierer();
        this.height = window.innerHeight + 'px';
        this.mainMap.streetViewControl = false;
        this.mainMap.zoomControl = !this.mobileQuery.matches;
        this.mainMap.zoom = 16;
        // this.errorWindow.open();
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition((pos: Position) => {
                // this.navigation = _coords_to_inavigate(pos.coords);
                this.navigation = {
                    lat: 39.682446,
                    lng: -104.964523
                };
            }, (err: PositionError) => {
                this.handleLocationError(true, this.errorWindow, { lat: this.mainMap.latitude, lng: this.mainMap.longitude });
            });
        else
            this.handleLocationError(false, this.errorWindow, { lat: this.mainMap.latitude, lng: this.mainMap.longitude });
    }

    mapsReady($event: GoogleMap) {
        this.communities = this.comsServive.locationSearch(this.navigation);
        if (!this.hasError) {
            this.pins = [];
            this.hyps = [];
            this.communities.forEach(comm => {
                this.pins.push({
                    com: comm,
                    expanded: false,
                    open: false
                });
                this.hyps.push(comm.hyp);
            });
        }
            try {
            if (typeof this.navigation.lat !== 'number' && typeof this.navigation.lng !== 'number')
                    throw new Error('Cannot determine location. The browser connection is not https.');
            } catch (e) {
            this.mainMap.latitude = this.errorCords.lat;
            this.mainMap.longitude = this.errorCords.lng;
            this.handleLocationError(true, this.errorWindow, this.errorCords);
                console.log(e);
        }
        this.mainMap.triggerResize();
    }

    handleLocationError(browserHasGeolocation: boolean, infoWindow: AgmInfoWindow, pos: INavigation) {
        this.hasError = true;
        const hasPos = typeof pos.lat === 'number' && typeof pos.lng === 'number';
        infoWindow.latitude = hasPos ? pos.lat : this.errorCords.lat;
        infoWindow.longitude = hasPos ? pos.lng : this.errorCords.lng;

        this.errorContent = browserHasGeolocation ?
            `Error: The Geolocation service failed.
             Have you allowed location services?` :
            'Error: Your browser doesn\'t support geolocation.';
        infoWindow.open();
    }

    aClick() {
        console.log('aaa');
        if (this.aState === 'showing') {
            this.aState = 'hidden';
            $('#pannels').css({ 'position': 'fixed' });
            $('#pannels').addClass(['col-12 col-sm-7 col-md-6 col-lg-5 col-xl-4']);
        } else {
            this.aState = 'showing';
            $('#pannels').css({ 'position': 'static' });
            $('#pannels').removeClass(['col-12 col-sm-7 col-md-6 col-lg-5 col-xl-4']);
        }
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
    openChange(event: boolean, pin: IPin) {
        // console.log(event);
        // pin.expanded = event;
        console.log(event);
        // this.cd.detach();
        pin.expanded = event;
        // this.cd.detectChanges();
        // this.cd.reattach();
    }

    centerChange(cent: LatLngLiteral) {
        const chyp = Math.sqrt(Math.pow(cent.lat, 2) + Math.pow(cent.lng, 2));
        const sorted = this.pins.slice().sort((a, b) => {
            // const ah = a.com.hyp - chyp;
            // const bh = b.com.hyp - chyp;
            const ah = Math.pow((a.com.nav.lat - cent.lat), 2) + Math.pow((a.com.nav.lng - cent.lng), 2);
            const bh = Math.pow((b.com.nav.lat - cent.lat), 2) + Math.pow((b.com.nav.lng - cent.lng), 2);
            if (ah < bh)
                return -1;
            if (ah > bh)
                return 1;
            return 0;
        });
        this.pins = sorted;
        // setTimeout(() => { this.pins = sorted; this.cd.detectChanges(); }, 1000);
    }

    expClose(pin: IPin) {
        this.cd.detectChanges();
        pin.expanded = false;
    }

    mobileQuierer() {
        this.height = window.innerHeight + 'px';
        if (this.mobileQuery.matches) {
            this.maxCards = 1;
            this.expOpen = (pin) => {
                /*
                this.cd.detach();
                const location = this.pins.indexOf(pin);
                this.pins.forEach(p => p.expanded = false);
                this.pins[location].expanded = true;
                this.cd.reattach();
                */
                pin.expanded = true;
                this.navigation = {
                    lat: pin.com.nav.lat - 0.2 / this.mainMap.zoom,
                    lng: pin.com.nav.lng
                };
                if (this.mainMap.zoom < 12) this.navigation.lat -= 3;
                this.mainMap.triggerResize(true);
            };
        } else {
            this.maxCards = 3;
            this.expOpen = (pin) => {
                console.log('exp');
                this.cd.detectChanges();
                pin.expanded = true;
                /*
                const location = this.pins.indexOf(pin);
                this.pins.forEach(p => p.expanded = false);
                this.pins[location].expanded = true;
                */
            };
        }
    }

    searchClick() {
        console.log('search');
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}

interface IPin {
    com: ICommunity;
    expanded: boolean;
    open: boolean;
}