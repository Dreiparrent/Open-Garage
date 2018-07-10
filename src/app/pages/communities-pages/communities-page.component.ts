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
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AlertService, Alerts } from '../../shared/alerts/alert.service';
import { firestore } from 'firebase';

@Component({
    selector: 'app-communities-page',
    templateUrl: './communities-page.component.html',
    styleUrls: ['./communities-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CommunitiesPageComponent implements OnInit {

    @ViewChild('mainMap') mainMap: AgmMap;
    @ViewChild('errorWindow') errorWindow: AgmInfoWindow;
    navigation: firestore.GeoPoint; // = new firestore.GeoPoint(null, null );
    errorCords: firestore.GeoPoint = new firestore.GeoPoint(39.682380, -104.964384);
    hasError = false;
    errorContent: string;
    comIcon = 'assets/icons/ic_com_pin@2x.png';

    zoom = 16;

    get pins() {
        return this.comsService.pins.getValue();
    }
    private _pinTimeout = setTimeout(() => { });
    tmpPins: any;

    constructor(private comsService: CommunitiesService, private alertService: AlertService) {
    }

    ngOnInit() {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition((pos: Position) => {
                // this.navigation = _coords_to_inavigate(pos.coords);
                this.navigation = new firestore.GeoPoint(39.682446, -104.964523);
            }, (err: PositionError) => {
                const mapGeo = new firestore.GeoPoint(this.mainMap.latitude, this.mainMap.longitude);
                this.handleLocationError(true, this.errorWindow, mapGeo);
            });
        else {
            const mapGeo = new firestore.GeoPoint(this.mainMap.latitude, this.mainMap.longitude);
            this.handleLocationError(false, this.errorWindow, mapGeo);
        }
        /*
        this.comsService.pins.asObservable().subscribe(
            pins => {
                console.log(pins);
                this.tmpPins = pins.map((p: Pin) => new Pin(p.com, p.expanded, p.open));
            },
            e => console.log(e), () => this.pushPins());
            */
    }

    handleLocationError(browserHasGeolocation: boolean, infoWindow: AgmInfoWindow, pos: firestore.GeoPoint) {
        this.hasError = true;
        const hasPos = typeof pos.latitude === 'number' && typeof pos.longitude === 'number';
        infoWindow.latitude = hasPos ? pos.latitude : this.errorCords.latitude;
        infoWindow.longitude = hasPos ? pos.longitude : this.errorCords.longitude;

        this.errorContent = browserHasGeolocation ?
            `Error: The Geolocation service failed.
             Have you allowed location services?` :
            'Error: Your browser doesn\'t support geolocation.';
        infoWindow.open();
        this.alertService.addAlert(Alerts.locationError);
    }

    mapReady(evt: any) {
        // nothing
    }

    pushPins() {
        console.log(this.tmpPins);
    }

    centerChange(evt: LatLngLiteral) {
        // console.log(evt);
        clearTimeout(this._pinTimeout);
        this._pinTimeout = setTimeout(this._centerChange.bind(this, evt), 1000);
    }

    private _centerChange(evt: LatLngLiteral) {
        this.comsService.pinLocation(new firestore.GeoPoint(evt.lat, evt.lng));
    }

    openChange(isOpen: boolean, open: boolean, link: string) {
        console.log('OC1', isOpen, link);
        this.comsService.pinChange(isOpen, link);
    }
}
interface IMarker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}
export interface IPin {
    com: ICommunity;
    expanded: boolean;
    open: boolean;
}
class Pin implements IPin {
    com: ICommunity;
    expanded: boolean;
    open: boolean;
    constructor(private _com: ICommunity,
        private _expanded: boolean,
        private _open: boolean) {
        this.com = _com;
        this.expanded = _expanded;
        this.open = _open;
    }
}