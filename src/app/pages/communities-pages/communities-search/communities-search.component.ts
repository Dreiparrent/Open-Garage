import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatAccordion } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IPin } from '../communities-page.component';
import { Observable } from '@firebase/util';
import { CommunitiesService } from '../../../shared/community/communities.service';

@Component({
    selector: 'app-communities-search',
    templateUrl: './communities-search.component.html',
    styleUrls: ['./communities-search.component.scss'],
    animations: [
        trigger('aArrow', [
            state('showing', style({ transform: 'rotate(0deg)' })),
            state('hidden', style({ transform: 'rotate(180deg)' })),
            transition('showing => hidden', animate('500ms 1.0s ease-out')),
            transition('hidden => showing', animate('500ms 1.0s ease-in'))
        ]),
        trigger('aAccordion', [
            state('showing', style({ left: '0', zIndex: '101' })),
            state('hidden', style({ left: '-98%', zIndex: '99' })),
            transition('showing => hidden', animate('200ms ease-out')),
            transition('hidden => showing', animate('200ms ease-in'))
        ])
    ]
})
export class CommunitiesSearchComponent implements OnInit {
    aState = 'showing';
    get pins() {
        return this.comsService.pins.asObservable();
    }
    // @Input('pins') pins: Observable<IPin[]>;
    // @Output('change') change = new EventEmitter<[boolean, string]>();
    constructor(private comsService: CommunitiesService) { }
    ngOnInit() {

    }

    pannelOpen(isOpen: boolean, open: boolean, link: string) {
        console.log('OC2', isOpen, link);
        this.comsService.pinChange(isOpen, link);
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
/*
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
        */ /*
        // if (this.mainMap.zoom < 12) this.navigation.lat -= 3;
        // this.mainMap.triggerResize(true);
        };
        /*
        this.expOpen = (pin) => {
            pin.expanded = true;
            pin.open = true;
        };
        *//*
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
*/