import { Component, OnInit, Input } from '@angular/core';
import { ICommunity, IImg } from '../../community/community-interfaces';

@Component({
    selector: 'app-communities-card',
    templateUrl: './communities-card.component.html',
    styleUrls: ['./communities-card.component.scss']
})
export class CommunitiesCardComponent implements OnInit {

    @Input('community') community: ICommunity;
    constructor() {
    }

    ngOnInit() {
        // console.log('new', this.community);
    }

}
