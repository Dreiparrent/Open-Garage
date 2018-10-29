import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NavigationService } from '../../../shared/navigation/navigation-service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommunityService } from '../../../shared/community/community.service';
import { CommunitySearchType, IUser, IUserData, IImg } from '../../../shared/community/community-interfaces';
import { ENTER } from '@angular/cdk/keycodes';
import { CommunitiesService, SimpleFilter } from '../../../shared/community/communities.service';

export class SearchOptions {
    constructor(public name: string, public type: number) { }
}

@Component({
    selector: 'app-community-jumbotron',
    templateUrl: './community-jumbotron.component.html',
    styleUrls: ['./community-jumbotron.component.scss']
})
export class CommunityJumbotronComponent implements OnInit {

    @ViewChild('jumbotron') jumbotron: ElementRef<HTMLElement>;
    comImg: IImg;
    @Output() height = new EventEmitter<string>();

    constructor(private comService: CommunityService) {
    }

    ngOnInit() {
        this.comService.comImg.subscribe(img => {
            if (img)
                this.comImg = img;
            setTimeout(() => {
                const tmpHeight = $('#com-img').height();
                if (tmpHeight > window.innerHeight * 2 / 3 )
                    this.height.emit('60vh');
                else this.height.emit(`${tmpHeight - tmpHeight / 10} px`);
            }, 500);
        });
    }

    getImg() {
        console.log(this.comService.comImg);
    }

}
