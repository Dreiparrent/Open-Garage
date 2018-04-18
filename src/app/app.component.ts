import { Component } from '@angular/core';
import { SwUpdateService } from './sw-update.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'app';
    constructor(private updates: SwUpdateService) { }
}
