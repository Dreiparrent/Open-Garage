import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { AgmMap, AgmInfoWindow } from '@agm/core';
import { INavigation, ICommunity } from '../../../shared/community/community-interfaces';
import { GoogleMap, LatLngLiteral } from '@agm/core/services/google-maps-types';
import { IPin } from '../communities-page.component';

@Component({
    selector: 'app-communities-map',
    templateUrl: './communities-map.component.html',
    styleUrls: ['./communities-map.component.scss']
})
export class CommunitiesMapComponent implements OnInit {

    @Input('height') height: number;
    @Input('zoom') zoom: boolean;
    @Input('pins') pins: IPin[] = [];
    @Input('moveMap')
    set moveMap(move: boolean) {
        if (move)
            if (this.ePin) {
                /*
                const newNav: INavigation = {
                    lat: this.iPin.com.nav.lat - this.navigation.lat,
                    lng: this.iPin.com.nav.lng - this.navigation.lng
                };
                */
                this.navigation = {
                    lat: this.ePin.com.nav.lat,
                    lng: this.ePin.com.nav.lng
                };
                this.mainMap.triggerResize(true);
                console.log('moved');
            }
    }
    @Input()
    set iPin(iPin: IPin) {
        if (iPin)
            this.pins.forEach(pin => {
                pin.expanded = iPin.com === pin.com;
            });
    }
    private _ePin: IPin;
    // tslint:disable-next-line:no-output-rename
    @Output('ePin') ePinEvent = new EventEmitter<IPin>();
    set ePin(pin: IPin) {
        this._ePin = pin;
        this.ePinEvent.next(pin);
    }
    get ePin() { return this._ePin; }
    @Output('center') center = new EventEmitter<INavigation>();


    comIcon = 'assets/icons/ic_com_pin@2x.png';
    navigation: INavigation = { lat: undefined, lng: undefined };
    errorCords: INavigation = { lat: 39.682380, lng: -104.964384 };
    hasError = false;
    errorContent: string;

    @ViewChild('mainMap') mainMap: AgmMap;
    @ViewChild('errorWindow') errorWindow: AgmInfoWindow;

    constructor() { }

    ngOnInit() {
        this.mainMap.streetViewControl = false;
        this.mainMap.zoomControl = this.zoom;
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

    mapsReady($event: GoogleMap) {
        // this.communities = this.comsServive.locationSearch(this.navigation);
        /*
        if (!this.hasError) {
            this.pins = [];
            this.hyps = [];
            this.communities.forEach(comm => {
                this.pins.push({
                    com: comm,
                    expanded: false,
                    open: false
                });
                // this.hyps.push(comm.hyp);
            });
        }
        */
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

    centerChange(cent: LatLngLiteral) {
        const chyp = Math.sqrt(Math.pow(cent.lat, 2) + Math.pow(cent.lng, 2));
        this.center.next(cent);
        // this.pins = sorted;
        // setTimeout(() => { this.pins = sorted; this.cd.detectChanges(); }, 1000);
    }

    markerClick(pin: IPin) {
        this.ePin = pin;
        /*
        pin.expanded = !pin.expanded;
        if (!this.pins.slice(0, 2).includes(pin)) {
            this.navigation = {
                lat: (this.mainMap.zoom < 15) ? pin.com.nav.lat : this.navigation.lat,
                lng: pin.com.nav.lng
            };
            this.mainMap.triggerResize(true);
        }
        */
    }
    markerClose(pin: IPin) {
        pin.expanded = false;
        let shouldNull = true;
        this.pins.forEach(p => { if (p.expanded) shouldNull = false; });
        if (shouldNull)
            this.ePin = null;
    }

}