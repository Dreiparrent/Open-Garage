import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchPageComponent } from '../search-page.component';

@Component({
    selector: 'app-search-404',
    templateUrl: './search-404.component.html',
    styleUrls: ['./search-404.component.scss']
})
export class Search404Component extends SearchPageComponent implements OnInit {

    // searchControl = this.searchControl;
    /*
    ngOnInit() {
        this.searchControl.get('search');
    }
    */
}
