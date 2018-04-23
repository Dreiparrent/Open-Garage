import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AgmInfoWindow, AgmMap } from '@agm/core';
import { GoogleMap } from '@agm/core/services/google-maps-types';

@Component({
    selector: 'app-communities-page',
    templateUrl: './communities-page.component.html',
    styleUrls: ['./communities-page.component.scss']
})
export class CommunitiesPageComponent implements OnInit {

    lat: number;
    lng: number;
    height = '300px';
    comIcon = 'assets/icons/ic_com_pin@2x.png';

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
                // this.lat = pos.coords.latitude;
                // this.lng = pos.coords.longitude;
                this.lat = 39.682446;
                this.lng = - 104.964523;
            }, (err: PositionError) => {
                this.handleLocationError(true, this.errorWindow, { lat: this.mainMap.latitude, lng: this.mainMap.longitude });
            });
        else
            this.handleLocationError(false, this.errorWindow, { lat: this.mainMap.latitude, lng: this.mainMap.longitude });
    }

    mapsReady($event: GoogleMap) {
        console.log($event.getCenter());
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
        this.mainMap.triggerResize();
    }

    handleLocationError(browserHasGeolocation: boolean, infoWindow: AgmInfoWindow, pos: { lng: number, lat: number }) {
        infoWindow.latitude = pos.lat;
        infoWindow.longitude = pos.lng;
        const contNode = new Node();
        contNode.textContent = browserHasGeolocation ? 'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.';
        infoWindow.content = contNode;
        infoWindow.open();
    }

}

interface IPin {
    name: string;
    lat: number;
    lng: number;
}