import { Component, Output, EventEmitter } from '@angular/core';
import { NavigationService } from '../navigation-service';

@Component({
    selector: 'app-nav-button',
    templateUrl: './nav-button.component.html',
    styleUrls: ['./nav-button.component.scss']
})
export class NavButtonComponent {

    @Output() navClick = new EventEmitter();

    constructor(private navService: NavigationService) { }

    toggleNav() {
        this.navClick.emit('click');
    }

}
