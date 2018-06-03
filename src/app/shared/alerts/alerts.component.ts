import { Component, OnInit, Input } from '@angular/core';
import { AlertService, Alerts, IAlert } from './alert.service';

@Component({
    selector: 'app-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {
    alerts = [];

    constructor(private alertService: AlertService) {
        alertService.getAlerts().subscribe(alerts => {
            this.alerts = alerts;
        });
    }

    onClosed(dismissedAlert: IAlert): void {
        this.alertService.removeAlert(dismissedAlert);
    }
}