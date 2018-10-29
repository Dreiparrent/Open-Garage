import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatCard } from '@angular/material';
import { CommunityService } from '../../community/community.service';
import { IImg } from '../../community/community-interfaces';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {

    @Input('name') name;
    @Input('location') location;
    @Input('connections') connections;
    @Input('imgUrl') imgUrl: IImg;
    private _overlay = false;
    @Input('overlay')
    set overlay(o: boolean) {
        this._overlay = o;
        if (o === false && this.$cardMain)
            this.$cardMain.removeClass('card-overlay-click');
            /*
        else if (this.$cardMain)
            this.$cardMain.addClass('card-overlay-click');
            */
    }
    get overlay() {
        return this._overlay;
    }
    betterImage: string;
    showFooter = environment.showProfileFooter;

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