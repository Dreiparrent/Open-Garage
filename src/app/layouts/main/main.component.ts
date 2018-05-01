import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    side: boolean;

    constructor(private route: ActivatedRoute) {
        this.side = this.route.snapshot.data['side'];
    }

    ngOnInit() {
    }

}