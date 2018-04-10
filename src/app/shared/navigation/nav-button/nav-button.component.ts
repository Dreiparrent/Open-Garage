import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-nav-button',
    templateUrl: './nav-button.component.html',
    styleUrls: ['./nav-button.component.scss']
})
export class NavButtonComponent {

    @Output() navClick = new EventEmitter();

    constructor() { }

    toggleNav() {
        this.navClick.emit('click');
    }
}
