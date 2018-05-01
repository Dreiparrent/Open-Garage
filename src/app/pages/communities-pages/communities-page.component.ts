import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'snazzy-info-window/dist/snazzy-info-window.css';
import { AgmInfoWindow, AgmMap } from '@agm/core';
import { GoogleMap } from '@agm/core/services/google-maps-types';
import { AgmSnazzyInfoWindow } from '@agm/snazzy-info-window';

@Component({
    selector: 'app-communities-page',
    templateUrl: './communities-page.component.html',
    styleUrls: ['./communities-page.component.scss']
})
export class CommunitiesPageComponent implements OnInit {

    lat: number;
    lng: number;
    errorCords = { lat: 0, lng: 0 };
    height = '300px';
    comIcon = 'assets/icons/ic_com_pin@2x.png';
    hasError = false;
    errorContent: string;

    @ViewChild('mainMap') mainMap: AgmMap;
    @ViewChild('errorWindow') errorWindow: AgmInfoWindow;

    pins: IPin[];

    constructor(private el: ElementRef) {
        const w = document.body.clientWidth;
    }

    ngOnInit() {
        this.height = window.innerHeight + 'px';
        this.mainMap.zoom = 16;
        this.mainMap.streetViewControl = false;
        // this.errorWindow.open();
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition((pos: Position) => {
                this.lat = pos.coords.latitude;
                this.lng = pos.coords.longitude;
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
            const servicePins = [
                {
                    name: 'test1',
                    lat: this.lat,
                    lng: this.lng
                },
                {
                    name: 'test2',
                    lat: this.lat + 0.005,
                    lng: this.lng + 0.005
                }];
            servicePins.forEach(pin => this.pins.push(pin));
            try {
                if (typeof this.lat !== 'number' && typeof this.lng !== 'number')
                    throw new Error('Cannot determine location. The browser connection is not https.');
                this.mainMap.triggerResize();
            } catch (e) {
                this.handleLocationError(true, this.errorWindow, { lat: 0, lng: 0 });
                console.log(e);
                alert('The browser you are connecting from is unable to obtain a secure connection');
            }
        }
    }

    handleLocationError(browserHasGeolocation: boolean, infoWindow: AgmInfoWindow, pos: { lng: number, lat: number }) {
        const hasPos = typeof pos.lat === 'number' && typeof pos.lng === 'number';
        this.hasError = true;
        infoWindow.latitude = hasPos ? pos.lat : 0;
        infoWindow.longitude = hasPos ? pos.lng : 0;

        this.errorContent = browserHasGeolocation ?
            'Error: The Geolocation service failed. Have you allowed location services for this site?' :
            'Error: Your browser doesn\'t support geolocation.';
        infoWindow.open();
    }

}

interface IPin {
    name: string;
    lat: number;
    lng: number;
}