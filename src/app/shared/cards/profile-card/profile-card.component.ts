import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-profile-card',
    templateUrl: './profile-card.component.html'
})
export class ProfileCardComponent {

    @Input('name') name;
    @Input('location') location;
    @Input('connections') connections;
    @Input('imgUrl') imgUrl;

    constructor() { }

}
