import {
    ElementRef, Output, Directive, AfterViewInit, OnDestroy, EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/startWith';

@Directive({
    selector: '[appAppear]'
})
export class AppearDirective implements AfterViewInit, OnDestroy {
    @Output()
    appAppear: EventEmitter<boolean>;

    private _visibility;
    private set visibility(visible: boolean) {
        this._visibility = visible;
        this.appAppear.emit(visible);
    }
    private get visibility() {
        return this._visibility;
    }

    elementPos: number;
    elementHeight: number;

    scrollPos: number;
    windowHeight: number;

    subscriptionScroll: Subscription;
    subscriptionResize: Subscription;

    constructor(private element: ElementRef) {
        this.appAppear = new EventEmitter<boolean>();
        console.log('start');
    }

    saveDimensions() {
        this.elementPos = this.getOffsetTop(this.element.nativeElement);
        this.elementHeight = this.element.nativeElement.offsetHeight;
        this.windowHeight = window.innerHeight;
    }
    saveScrollPos() {
        this.scrollPos = window.scrollY + document.documentElement.clientHeight;
    }
    getOffsetTop(element: any) {
        let offsetTop = element.offsetTop || 0;
        if (element.offsetParent)
            offsetTop += this.getOffsetTop(element.offsetParent);
        return offsetTop;
    }
    checkVisibility() {
        if (this.isVisible()) {
            // double check dimensions (due to async loaded contents, e.g. images)
            this.saveDimensions();
            // tslint:disable-next-line:curly
            if (this.isVisible() && !this.visibility) {
                this.visibility = true;
            }
        } else if (this.visibility)
            this.visibility = false;
    }
    isVisible() {
        return this.scrollPos >= this.elementPos || (this.scrollPos + this.windowHeight) >= (this.elementPos + this.elementHeight);
    }

    subscribe() {
        this.subscriptionScroll = Observable.fromEvent(window, 'scroll').startWith(null)
            .subscribe(() => {
                this.saveScrollPos();
                this.checkVisibility();
            });
        this.subscriptionResize = Observable.fromEvent(window, 'resize').startWith(null)
            .subscribe(() => {
                this.saveDimensions();
                this.checkVisibility();
            });
    }
    unsubscribe() {
        if (this.subscriptionScroll)
            this.subscriptionScroll.unsubscribe();
        if (this.subscriptionResize)
            this.subscriptionResize.unsubscribe();
    }

    ngAfterViewInit() {
        this.subscribe();
    }
    ngOnDestroy() {
        this.unsubscribe();
    }
}