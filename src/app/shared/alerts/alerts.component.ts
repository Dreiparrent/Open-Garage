import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {

    @Input('toggle')
    toggle = false; // romove this and remove the alert toggle
    @Input('type')
    type = 'danger'; // TODO: change this to by enum or interface
    // also, this will probable need a service
    // also also change these colors to be the right colors

    alerts = this.toggle ? [
        {
            type: 'danger',
            msg: 'You\'re missing your pofile photo'
        }
    ] : [];

    constructor() { }

    onClosed(dismissedAlert: any): void {
        this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
    }

    /*
    defaultAlerts: any[] = [
        {
            type: 'success',
            msg: `You successfully read this important alert message.`
        },
        {
            type: 'info',
            msg: `This alert needs your attention, but it's not super important.`
        },
        {
            type: 'warning',
            msg: `Better check yourself, you're not looking too good.`
        }
    ];
    alerts = this.defaultAlerts;
    onClosed(dismissedAlert: any): void {
        this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
    }
    */
}
