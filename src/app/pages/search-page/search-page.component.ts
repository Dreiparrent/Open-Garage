import { Component, OnInit } from '@angular/core';
import { ICommunity } from '../../shared/community/community-interfaces';
import { CommunitiesService } from '../../shared/community/communities.service';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
    communities: ICommunity[];
    /*
    communities: ICommunity[] = [
        {
            name: 'Test Community',
            desc: 'a short description about the community and such',
            img: {
                webp: '../../../assets/img/photos/eclipse.webp',
                jpf: '../../../assets/img/photos/eclipse.jpf',
                else: '../../../assets/img/photos/eclipse.jpg'
            },
            location: 'Denver',
            members: 8,
            link: 'testlink'
        },
        {
            name: 'Test Community',
            desc: 'a short description about the community and such',
            img: {
                webp: '../../../assets/img/photos/eclipse.webp',
                jpf: '../../../assets/img/photos/eclipse.jpf',
                else: '../../../assets/img/photos/eclipse.jpg'
            },
            location: 'Denver',
            members: 8,
            link: 'testlink'
        },
        {
            name: 'Test Community',
            desc: 'a short description about the community and such',
            img: {
                webp: '../../../assets/img/photos/eclipse.webp',
                jpf: '../../../assets/img/photos/eclipse.jpf',
                else: '../../../assets/img/photos/eclipse.jpg'
            },
            location: 'Denver',
            members: 8,
            link: 'testlink'
        }
    ];
    */

    constructor(private comsService: CommunitiesService) { }

    ngOnInit() {
        this.communities = this.comsService.locationSearch({ lat: 39.68238, lng: -104.964384});
    }

}
