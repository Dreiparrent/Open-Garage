import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private _alerts = new BehaviorSubject<IAlert[]>([]);
    private set alerts(alerts: IAlert[]) {
        this._alerts.next(alerts);
    }
    private get alerts() {
        return this._alerts.getValue();
    }

    constructor(private route: ActivatedRoute, private router: Router) {
        route.queryParams.subscribe(params => {
            if (params['login'])
                this.addAlert(Alerts.login);
            if (params['reload'])
                location.reload(true);
            if (params['userSearch']) {
                this.removeAlert(enumAlerts[Alerts.noCommunity]);
                this.router.navigate(['/search']);
            }
        });
    }

    addAlert(alert: Alerts, customAlert?: IAlert): IAlert {
        if (alert === Alerts.custom) {
            this.alerts.push(customAlert);
            return;
        }
        const newAlert = enumAlerts[alert];
        if (!newAlert.multiple && this.alerts.includes(newAlert))
            return;
        this.alerts.push(newAlert);
        return newAlert;
    }

    removeAlert(deleteAlert: IAlert) {
        if (deleteAlert === enumAlerts[Alerts.login])
            this.router.navigate(['/']);
        const tmpA = this.alerts;
        this.alerts = this.alerts.filter(alert => alert !== deleteAlert);
    }

    getAlerts() {
        return this._alerts.asObservable();
    }
}
export interface IAlert {
    type: 'danger' | 'warning' | 'info' | 'success';
    msg: string;
    link?: {
        route: string[];
        msg: string;
        params?: object;
        skipChange?: boolean;
    };
    multiple?: boolean;
}
export enum Alerts {
    custom = -1,
    incomelete,
    noPhoto,
    noCommunity,
    message,
    login,
    logout,
    loginToAccess,
    loginForFull,
    userError,
    communityError,
    locationError
}
const enumAlerts: IAlert[] = [
    {
        msg: 'Your profile is incomelete',
        type: 'danger',
        link: {
            msg: 'Click to complete',
            route: ['/', 'register'],
            params: {
                incomplete: true
            }
        }
    },
    {
        msg: 'Your profile is missing a profile image',
        type: 'danger'
    },
    {
        msg: 'You haven\'t joined a community yet',
        type: 'info',
        link: {
            msg: 'Click to join',
            route: ['/', 'search'],
            params: {
                userSearch: true
            },
            skipChange: true
        }
    },
    {
        msg: 'New message',
        type: 'success'
    },
    {
        msg: 'Successfully logged in',
        type: 'success'
    },
    {
        msg: 'Successfully logged out',
        type: 'success',
        link: {
            msg: 'click to reload',
            route: ['./'],
            params: {
                reload: true
            },
            skipChange: true
        }
    },
    {
        msg: 'Only registered members can access this',
        type: 'info',
    },
    {
        msg: 'Login to view or join community',
        type: 'info'
    },
    {
        msg: 'An error occured while trying to get user data',
        type: 'danger'
    },
    {
        msg: 'An error occured while trying to get community data',
        type: 'danger'
    },
    {
        msg: 'Location services not allowed',
        type: 'warning'
    }
];