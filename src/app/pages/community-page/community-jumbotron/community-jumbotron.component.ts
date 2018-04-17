import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavigationService } from '../../../shared/navigation/navigation-service';

@Component({
    selector: 'app-community-jumbotron',
    templateUrl: './community-jumbotron.component.html',
    styleUrls: ['./community-jumbotron.component.scss']
})
export class CommunityJumbotronComponent implements OnInit, OnDestroy {

    @ViewChild('jumbotron') jumbotron: ElementRef;

    constructor() { }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

}
