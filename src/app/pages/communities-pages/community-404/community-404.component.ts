import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-community-404',
    templateUrl: './community-404.component.html',
    styleUrls: ['./community-404.component.scss']
})
export class Community404Component implements OnInit {

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['search'])
                console.log(params['search']);
        });
    }

}
