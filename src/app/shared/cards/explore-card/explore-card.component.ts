import { Component, OnInit, Input, AfterViewInit, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-explore-card',
    templateUrl: './explore-card.component.html',
    styleUrls: ['./explore-card.component.scss'],
})
export class ExploreCardComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input('users') users: IExploreUser[];
    oLeft: number;
    oTop: number;
    listeners: any[] = [];

    constructor(private el: ElementRef<HTMLElement>, private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.oLeft = this.el.nativeElement.offsetLeft;
        this.oTop = this.el.nativeElement.offsetTop;
    }
    ngAfterViewInit() {
        for (let i = 0; i < this.users.length - 1; i++)
            this.createScroll(i);
    }

    ngOnDestroy(): void {
        // TODO: remove scroll listenerss
        this.listeners.forEach(listener => {
            window.removeEventListener('scroll', listener);

        });
    }

    drawLink(index: number) {
        const $line = $(`#line-${index}`);
        const $parent1 = $(`#parent-${index}`).position();
        const $parent2 = $(`#parent-${index + 1}`).position();
        const $skpa1 = $(`#skpa-${index}`).position();
        const $skpa2 = $(`#skpa-${index + 1}`).position();
        console.log($parent1, $parent2);
        $line.attr('x1', $parent1.left).attr('y1', $parent1.top).attr('x2', $parent2.left).attr('y2', $parent2.top);
    }

    getX(index: number, x2 = false) {
        const $icon = $(`#ic-${x2 ? index + 1 : index}`);
        let w = $icon.offset().left;
        if (x2 === (index % 2 !== 0))
            w += $icon.width();
        return w;
    }
    getY(index: number, y2 = false) {
        const $icon = $(`#ic-${y2 ? index + 1 : index}`);
        let h = $icon.offset().top;
        if (!y2)
            h += $icon.height();
        return h;
    }

    getLine(index: number): string {
        const $icon1 = $(`#ic-${index}`);
        const $icon2 = $(`#ic-${index + 1}`);
        let x1 = $icon1.offset().left;
        let x2 = $icon2.offset().left;
        if (index % 2 !== 0)
            x2 += $icon2.width();
        else x1 += $icon1.width();
        let y1, y2;
        y1 = $icon1.offset().top + $icon1.height();
        y2 = $icon2.offset().top;
        /*
        setTimeout(() => {
            y1 = $icon1.offset().top + $icon1.height();
            y2 = $icon2.offset().top;
        });
        */
        return `M${x1} ${y1}
            Q ${x1} ${y2 + ((y1 - y2) / 2)}
            ${x2} ${y2}`;
        // return `M${w1} ${h1} L${w2} ${h2}`;
    }

    createScroll(index: number) {
        const icon1: SVGPathElement = <any>document.getElementById(`line-${index}`);
        const length = icon1.getTotalLength();
        icon1.style.strokeDasharray = '' + length;
        setTimeout(() => {
            icon1.style.strokeDasharray = '' + icon1.getTotalLength();
        }, 2000);
        icon1.style.strokeDashoffset = '' + length;
        /*
        let type = -1;
        if (document.body.scrollTop + )
            type = 0;
        else if (document.documentElement.scrollTop)
        */
        const newI = index + 1;
        // $(window).scroll(scrollListener.bind(icon1, newI, length));
        const listener = scrollListener.bind(icon1, newI, length);
        this.listeners.push(listener);
        window.addEventListener('scroll', listener);
        // window.removeEventListener('scroll', scrollListener.bind(icon1, newI, length));
        // window.addEventListener('scroll', scrollIn.bind(icon1, index));
    }

}
// TODO: make this a single listener
const scrollListener = function (index: number, len: number) {
    let oTop: number;
    try {
        oTop = $(`#ic-${index}`).offset().top;
    } catch (error) {
        console.log(error);
        return;
    }
    let scrollPerc = (document.documentElement.scrollTop + document.documentElement.clientHeight - oTop)
        / ((document.documentElement.clientHeight / 3));
    // console.log(index, scrollPerc);
    if (scrollPerc <= 0) {
        const multiplier = (index % 2 === 0) ? 50 : -50;
        $(`#parent-${index}`).css('transform', `translateX(${scrollPerc * multiplier}%)`);
        return;
    } else {
        $(`#parent-${index}`).css('transform', `translateX(0)`);
        if (scrollPerc > 1)
            scrollPerc = 1;
    }
    const draw = len * scrollPerc;
    // Reverse the drawing (when scrolling upwards)
    this.style.strokeDashoffset = len - draw;
};
const scrollIn = function (index: number) {
    const oTop = $(`#card-${index}`).offset().top;
    const scroller = document.documentElement.scrollTop + document.documentElement.clientHeight + 10 - oTop;
    console.log(scroller);
};
export interface IExploreUser {
    name: string;
    imgUrl: string;
    com: string;
    skpa: string;
    type: -1 | 0 | 1;
    state: 'inactive' | 'inactive-true' | 'inactive-false' | 'active';
}