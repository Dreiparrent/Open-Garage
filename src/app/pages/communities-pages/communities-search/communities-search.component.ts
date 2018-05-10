import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatAccordion } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IPin } from '../communities-page.component';

@Component({
    selector: 'app-communities-search',
    templateUrl: './communities-search.component.html',
    styleUrls: ['./communities-search.component.scss'],
    animations: [
        trigger('aAccordion', [
            state('showing', style({ left: '0' })),
            state('hidden', style({ left: '-100%' })),
            transition('showing => hidden', animate('200ms ease-out')),
            transition('hidden => showing', animate('200ms ease-in'))
        ]),
        trigger('aArrow', [
            state('showing', style({ transform: 'rotate(0deg)' })),
            state('hidden', style({ transform: 'rotate(180deg)' })),
            transition('shoing => hidden', animate('1.0s 200ms ease-out')),
            transition('hidden => shoing', animate('1.0s 200ms ease-in'))
        ])
    ]
})
export class CommunitiesSearchComponent implements OnInit {

    @ViewChild('pannels') pannels: MatAccordion;
    aState = 'showing';
    @Input('pins') pins: IPin[] = [];
    @Input('zoom') zoom = 3;
    @Input()
    set iPin(iPin: IPin) {
        let newPins: IPin[];
        if (iPin)
            newPins = this.pins.map(p => {
                p.expanded = iPin.com === p.com;
                return p;
            });
        else
            newPins = this.pins.map(p => {
                p.expanded = false;
                return p;
            });
        this.pins = [];
        setTimeout(() => {
            this.pins = newPins;
        });
    }
    @Output('ePin') ePin = new EventEmitter<IPin>();

    expOpen: (pin: IPin) => void;

    constructor() { }

    ngOnInit() {
        this.expOpen = (pin) => {
            this.ePin.next(pin);
        /*
        this.cd.detach();
        const location = this.pins.indexOf(pin);
        this.pins.forEach(p => p.expanded = false);
        this.pins[location].expanded = true;
        this.cd.reattach();
        */
            // pin.expanded = true;
        /*
        pin.open = true;
        this.navigation = {
            lat: pin.com.nav.lat - 0.2 / this.mainMap.zoom,
            lng: pin.com.nav.lng
        };
        */
        // if (this.mainMap.zoom < 12) this.navigation.lat -= 3;
        // this.mainMap.triggerResize(true);
        };
        /*
        this.expOpen = (pin) => {
            pin.expanded = true;
            pin.open = true;
        };
        */
    }
    expClose(pin: IPin) {
        // pin.expanded = false;
    }
    searchClick() {
        console.log('search');
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
}
