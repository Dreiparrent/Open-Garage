import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import * as $ from 'jquery';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

    @ViewChild('popup') popup: ElementRef;

    constructor() { }

    ngOnInit() {
        $.getScript('/assets/js/gsap/TweenMax.min.js');
    }

    onClick() {
        //TweenLite.to($(this.popup),0.5,{right: '50vw'});
        // $(this.popup).css('right','50vw');
        console.log('test');
        TweenMax.to($(this.popup.nativeElement),0.3, {right: 0, easing: Power2.easeOut});
        //$(this.popup.nativeElement).css('margin-left','200px');
    }

}
