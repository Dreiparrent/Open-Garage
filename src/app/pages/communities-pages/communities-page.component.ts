import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import 'snazzy-info-window/dist/snazzy-info-window.css';
import { AgmInfoWindow, AgmMap } from '@agm/core';
import { GoogleMap } from '@agm/core/services/google-maps-types';
import { AgmSnazzyInfoWindow } from '@agm/snazzy-info-window';
import { NavigationService } from '../../shared/navigation/navigation-service';
import { MatExpansionPanel, MatAccordion } from '@angular/material';

@Component({
    selector: 'app-communities-page',
    templateUrl: './communities-page.component.html',
    styleUrls: ['./communities-page.component.scss']
})
export class CommunitiesPageComponent implements OnInit {

    navigation: INavigation = { lat: undefined, lng: undefined };
    errorCords: INavigation = { lat: 39.682380, lng: -104.964384 };
    height = '300px';
    comIcon = 'assets/icons/ic_com_pin@2x.png';
    hasError = false;
    errorContent: string;
    awaiter = false;

    @ViewChild('mainMap') mainMap: AgmMap;
    @ViewChild('errorWindow') errorWindow: AgmInfoWindow;
    @ViewChild('pannels') pannels: any;

    pins: IPin[];

    constructor(private el: ElementRef, private cd: ChangeDetectorRef, private navService: NavigationService) {
        const w = document.body.clientWidth;
    }

    ngOnInit() {
        // this.navService.communitySender();
        this.height = window.innerHeight + 'px';
        this.mainMap.streetViewControl = false;
        this.mainMap.zoom = 16;
        // this.errorWindow.open();
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition((pos: Position) => {
                this.navigation = this.coords_to_inavigate(pos.coords);
                // this.lat = 39.682446;
                // this.lng = - 104.964523;
            }, (err: PositionError) => {
                this.handleLocationError(true, this.errorWindow, { lat: this.mainMap.latitude, lng: this.mainMap.longitude });
            });
        else
            this.handleLocationError(false, this.errorWindow, { lat: this.mainMap.latitude, lng: this.mainMap.longitude });
    }

    mapsReady($event: GoogleMap) {
        if (!this.hasError) {
            this.pins = [];
            const servicePins: IPin[] = [
                {
                    expanded: false,
                    open: false,
                    name: 'Univeristy of Denver',
                    desc: 'The official communtiy of the University of Denver.',
                    nav: this.navigation
                },
                {
                    expanded: false,
                    open: false,
                    name: 'Local PD Community',
                    desc: 'The community for the Denver Police Department',
                    nav: {
                        lat: this.navigation.lat + 0.005,
                        lng: this.navigation.lng + 0.005
                    }
                }];
            servicePins.forEach(pin => this.pins.push(pin));
        }
            try {
            if (typeof this.navigation.lat !== 'number' && typeof this.navigation.lng !== 'number')
                    throw new Error('Cannot determine location. The browser connection is not https.');
            } catch (e) {
            this.mainMap.latitude = this.errorCords.lat;
            this.mainMap.longitude = this.errorCords.lng;
            this.handleLocationError(true, this.errorWindow, this.errorCords);
                console.log(e);
            // alert('The browser you are connecting from is unable to obtain a secure connection');
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
    pinOpen(pin: IPin, isPannel: boolean = false) {
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
    }

    coords_to_inavigate(coords: Coordinates): INavigation {
        const nav: INavigation = {
            lat: coords.latitude,
            lng: coords.longitude
        };
        return nav;
}

}
interface INavigation {
    lat: number;
    lng: number;
}
interface IPin {
    expanded: boolean;
    open: boolean;
    name: string;
    desc: string;
    nav: INavigation;
}