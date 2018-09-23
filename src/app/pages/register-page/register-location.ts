import { ElementRef, EventEmitter } from '@angular/core';
import { firestore } from 'firebase';
import { AlertService, Alerts, IAlert } from '../../shared/alerts/alert.service';
import { BehaviorSubject } from 'rxjs';
export class RegisterLocation {
    public navigation: firestore.GeoPoint;
    public name: string;
    public formattedAddress: string;
    public _valid = false;
    public valid = new BehaviorSubject(false);
    public latlng: google.maps.LatLng;

    private geocoder: google.maps.Geocoder;
    private gee: google.maps.places.PlacesService;
    private autocomplete: google.maps.places.Autocomplete;
    private autocompleter: google.maps.places.AutocompleteService;
    constructor(private alertService: AlertService,
        private locationInput: HTMLInputElement, private changeEvent: EventEmitter<string>) {
        /*
        this.locationInput.addEventListener('change', () => {
            this.valid = false;
            console.log('cahnge');
        });
        */
        changeEvent.subscribe(val => {
            // console.log(val);
            // if (!this.formattedAddress)
            this.valid.next(false);
        });
        this.autocomplete = new google.maps.places.Autocomplete(locationInput,
            { types: ['address'] });
        this.autocomplete.addListener('place_changed', () => {
            const place: google.maps.places.PlaceResult = this.autocomplete.getPlace(); // TODO: checker
            if (place) {
                this.name = place.name;
                this.formattedAddress = place.formatted_address;
                this.latlng = place.geometry.location;
                this.navigation = new firestore.GeoPoint(this.latlng.lat(), this.latlng.lng());
                this.valid.next(true);
            } else this.valid.next(false);
            // console.log('place:', place);
        });
        this.geocoder = new google.maps.Geocoder();
        this.autocompleter = new google.maps.places.AutocompleteService();
    }

    getLocation(): Promise<boolean> {
        return new Promise(res => {
            navigator.geolocation.getCurrentPosition((pos: Position) => {
                this.navigation = new firestore.GeoPoint(pos.coords.latitude, pos.coords.longitude);
                const latlng = new google.maps.LatLng(this.navigation.latitude, this.navigation.longitude);
                this.geocoder.geocode({
                    'location': latlng
                }, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK)
                        if (results) {
                            if (results[0].address_components[1].types.includes('street_number'))
                                this.name = results[0].address_components[0].long_name;
                            else this.name = results[0].address_components[1].long_name;
                            // this.place = results;
                            this.latlng = latlng;
                            this.valid.next(true);
                            res(true);
                        } else {
                            console.error('No results found');
                            res(false);
                        }
                    else
                        console.error('Geocoder failed due to: ' + status);
                    res(false);
                });
            }, (err: PositionError) => {
                res(false);
                // this.handleLocationError('refused'); // TODO: here
            });
        });
    }
}
