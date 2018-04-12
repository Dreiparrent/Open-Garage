import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-community-card',
    template: `
        <div class="card w-100">
            <div class="card-body row" [class.row]="!slider" [class.p-0]="slider">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    styles: [`
    .card {
        border-radius: 1px !important;
    }`]
})
export class CommunityCardComponent {

    @Input('slider') slider = false;
    @HostBinding('class.col-11') col11 = true;
    @HostBinding('class.col-md-10') col10 = true;
    @HostBinding('class.pb-2') pb2 = !this.slider;

    constructor() { }
}
