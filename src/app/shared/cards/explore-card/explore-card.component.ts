import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-explore-card',
    templateUrl: './explore-card.component.html',
    styleUrls: ['./explore-card.component.scss']
})
export class ExploreCardComponent implements OnInit {

    @Input('users') users: IExploreUser[];

    constructor() { }

    ngOnInit() {
    }

}
export interface IExploreUser {
    name: string;
    imgUrl: string;
    com: string;
    skpa: string;
    type: number;
}