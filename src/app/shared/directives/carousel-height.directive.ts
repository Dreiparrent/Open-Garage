import { Directive, ElementRef, AfterViewChecked, Input, HostListener, NgModule, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: '[appCarouselHeight]'
})
export class CarouselHeightDirective implements AfterViewChecked {
    // class name to match height
    @Input()
    appCarouselHeight: string;
    // @Output() testOut = new EventEmitter();

    constructor(private el: ElementRef) {
    }

    ngAfterViewChecked() {
        this.matchHeights(this.el.nativeElement, this.appCarouselHeight);
    }

    matchHeights(carousel: HTMLElement, className: string) {
        const carouselDiv = carousel.getElementsByClassName(className)[0];
        const cItems = carouselDiv.firstElementChild.firstElementChild.childNodes as NodeListOf<Element>;

        const preChildren = [];
        const children = [];
        Array.from(cItems).forEach((x: HTMLElement) => {
            if (x.childNodes[0])
                children.push(x.childNodes[0].firstChild);
        });

        Array.from(children).forEach((x: HTMLElement) => {
            // const newX = x.firstChild as HTMLElement;
            // newX.style.height = 'initial';
            x.style.height = 'initial';
        });
        // step 2a: get all the child elements heights
        const itemHeights = Array.from(children).map(x => {
            // const newX = x.firstChild as HTMLElement;
            // return newX.getBoundingClientRect().height;
            return x.getBoundingClientRect().height;
        });

        // step 2b: find out the tallest
        const maxHeight = itemHeights.reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        }, 0);
        // step 3: update all the child elements to the tallest height
        Array.from(children).forEach((x: HTMLElement) => {
            // const newX = x.firstChild as HTMLElement;
            // newX.style.height = `${maxHeight}px`;
            x.style.height = `${maxHeight}px`;
        });
    }

    @HostListener('window:resize')
    onResize() {
        // call our matchHeight function here
        this.matchHeights(this.el.nativeElement, this.appCarouselHeight);
    }
}