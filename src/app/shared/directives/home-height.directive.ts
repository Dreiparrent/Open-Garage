import { Directive, ElementRef, AfterViewChecked, Input, HostListener, NgModule } from '@angular/core';

@Directive({
    selector: '[appHomeHeight]'
})
export class HomeHeightDirective implements AfterViewChecked {
    // class name to match height
    @Input()
    appHomeHeight: string;

    maxHeight = 0;

    constructor(private el: ElementRef) {
    }

    ngAfterViewChecked() {
        // call our matchHeight function here
        this.matchHeights(this.el.nativeElement, this.appHomeHeight );
    }

    matchHeights(parent: HTMLElement, className: string) {
        // match height logic here
        if (!parent) return;

        // step 1: find all the child elements with the selected class name
        const children = parent.getElementsByClassName(className);

        if (!children) return;

        Array.from(children).forEach((x: HTMLElement) => {
            x.style.height = 'initial';
        });

        // step 2a: get all the child elements heights
        const itemHeights = Array.from(children)
            .map(x => x.getBoundingClientRect().height);

        // step 2b: find out the tallest
        const maxHeight = itemHeights.reduce((prev, curr) => {
            return curr > prev ? curr : prev;
        }, 0);

        this.maxHeight = maxHeight > this.maxHeight ? maxHeight : this.maxHeight;

        // step 3: update all the child elements to the tallest height
        Array.from(children)
            .forEach((x: HTMLElement) => x.style.height = `${this.maxHeight}px`);
    }

    @HostListener('window:resize')
    onResize() {
        // call our matchHeight function here
        this.matchHeights(this.el.nativeElement, this.appHomeHeight );
    }
}