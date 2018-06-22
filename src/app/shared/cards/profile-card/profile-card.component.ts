import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatCard } from '@angular/material';
import { CommunityService } from '../../community/community.service';

@Component({
    selector: 'app-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {

    @Input('name') name;
    @Input('location') location;
    @Input('connections') connections;
    @Input('imgUrl') imgUrl;
    @Input('overlay') overlay = false;

    @ViewChild('cardMain') cardMain: ElementRef<HTMLElement>;

    $cardMain: JQuery<HTMLElement>;

    constructor(private comService: CommunityService, private el: ElementRef<HTMLElement>) {
        /*
        this.cardMain.nativeElement.style.backgroundColor = 'black';
        if (this.overlay)
            this.cardMain.nativeElement.addEventListener('click', OnClick.bind(this.cardMain));
            */
    }

    ngOnInit(): void {
        this.$cardMain = $(this.cardMain.nativeElement);
        if (this.overlay)
            this.cardMain.nativeElement.addEventListener('click', OnClick.bind(this.$cardMain, this.el.nativeElement));
    }

}
const OnClick = function (el: HTMLElement) {
    console.log('click', this);
    const els = el.parentElement.parentElement.getElementsByClassName('card-overlay-click');
    $('.card-overlay-click').removeClass('card-overlay-click');
    this.addClass('card-overlay-click');
    /*
    comService.searchMembers.subscribe(members => {
        this.removeClass('card-overlay-click');
    });
    */
};