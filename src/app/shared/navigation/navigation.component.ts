import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as $ from 'jquery';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

    @ViewChild('overlay') private overlayElem: ElementRef;
    @ViewChild('popup') private popupElem: ElementRef;
    private popup: any;
    private overlay: any;

    // public vars
    public isHidden = true;
    public isOpen = false;

    constructor() { }

    ngOnInit() {
        this.popup = this.popupElem.nativeElement;
        this.overlay = this.overlayElem.nativeElement;
        $.getScript('/assets/js/gsap/TweenMax.min.js');
    }

    onClick() {
        this.isOpen = (this.isOpen) ? this.closeNav() : this.openNav();
    }

    public openNav(): boolean {
        this.isHidden = false;
        TweenMax.to($('section'), 0.5, {filter: 'blur(1px)'});
        TweenMax.to(this.popup, 0.3, { right: 0, ease: Power2.easeOut });
        TweenMax.to(this.overlay, 0.3, { autoAlpha: 0.6, ease: Power2.easeOut });
        return true;
    }

    public closeNav(): boolean {
        TweenMax.to($('section'), 0.5, { filter: 'blur(0)' });
        TweenMax.to($(this.popup), 0.3, { right: -30 + 'vw', ease: Power2.easeIn });
        TweenMax.to(this.overlay, 0.3, { autoAlpha: 0, ease: Power2.easeIn, onComplete: () => {
            this.isHidden = true;
        } });
        return false;
    }

}
