import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '../community/chat';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { LocationHelpDialogComponent } from '../cards/location-help-dialog/location-help-dialog.component';

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

    constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
        route.queryParams.subscribe(params => {
            if (params['login'])
                this.addAlert(Alerts.login);
            if (params['reload'])
                location.reload(true);
            if (params['joinCom']) { // TODO: fix this reload bs
                console.log(this.route.snapshot.url);
                // this.router.navigate(['./']);
                this.alerts.push(enumAlerts[Alerts.comJoinSuccess]);
            }
            if (params['newMessage']) {
                console.log('new message');
                this.removeAlert(enumAlerts[Alerts.newMessage]);
            }
            if (params['userSearch']) {
                this.removeAlert(enumAlerts[Alerts.noCommunity]);
                this.router.navigate(['/search']);
            }
            if (params['locationHelp']) {
                const dialogRef = this.dialog.open(LocationHelpDialogComponent, {
                    data: params['locationHelp'] === 'register', maxWidth: '65vw'
                });
                dialogRef.afterClosed().subscribe((result: {refused: boolean, reload: boolean}) => {
                    console.log('result', result);
                    // router.navigateByUrl(router.url, { queryParams: { locationHelp: false }, skipLocationChange: true });
                    // this.router.navigate([''], { queryParams: { locationHelp: false }, skipLocationChange: false });
                    const url: string = this.router.url.substring(0, this.router.url.indexOf('?'));
                    if (result.refused)
                        this.router.navigateByUrl(url + '?locationRefused=true');
                    else this.router.navigateByUrl(url);
                    if (result.reload)
                        location.reload(true);
                });
            }
        });
    }

    addAlert(alert: Alerts.comJoinSuccess | Alerts.communityError |
        Alerts.login | Alerts.loginForFull | Alerts.loginToAccess | Alerts.logout | Alerts.noCommunity |
        Alerts.noPhoto | Alerts.userError | Alerts.googleError | Alerts.imageUploadError): IAlert;
    addAlert(alert: Alerts.locationError | Alerts.incomplete, isRegister?: boolean): IAlert;
    addAlert(alert: Alerts.newMessage, message: Chat): IAlert;
    addAlert(alert: Alerts.messageError, message: Chat | any): IAlert;
    addAlert(alert: Alerts.custom, custom: IAlert): IAlert;
    addAlert(alert: Alerts, customAlert?: IAlert | Chat | boolean): IAlert {
        let newAlert: IAlert;
        switch (alert) {
            case Alerts.custom:
                this.alerts.push(customAlert as IAlert);
                break;
            case Alerts.incomplete:
                newAlert = enumAlerts[alert];
                // this.alerts.push(enumAlerts[Alerts.incomeleteAutoAlert]);
                if (customAlert === true) {
                    newAlert.msg = 'Profile already exists!';
                    newAlert.link = {
                        msg: 'Click to login',
                        route: ['/login']
                    };
                }
                break;
            case Alerts.locationError:
                newAlert = enumAlerts[alert];
                if (customAlert === true) {
                    newAlert.msg = 'Location service necessary to register';
                    newAlert.link.params = {
                        locationHelp: 'register'
                    };
                    newAlert.multiple = true;
                }
                break;
            case Alerts.comJoinSuccess:
                this.router.navigate(['./'], { queryParams: { joinCom: true }, relativeTo: this.route }).then(() => {
                    this.router.navigate(['./'], { queryParams: { reload: true }, skipLocationChange: false });
                });
            // tslint:disable-next-line:no-switch-case-fall-through
            default:
                newAlert = enumAlerts[alert];
                break;
        }
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
    incomplete,
    incomeleteAutoAlert,
    noPhoto,
    noCommunity,
    newMessage,
    messageError,
    login,
    logout,
    loginToAccess,
    loginForFull,
    userError,
    communityError,
    comJoinSuccess,
    locationError,
    googleError,
    imageUploadError
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
        msg: 'You will appear logged out until profile is completed',
        type: 'warning'
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
        type: 'success',
        link: {
            msg: 'view',
            route: ['./'],
            params: {
                newMessage: true
            },
            skipChange: true
        }
    },
    {
        msg: 'An Error occured while retrieving messages',
        type: 'danger'
    },
    { // 5
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
        msg: 'Please login for full access',
        type: 'info'
    },
    {
        msg: 'An error occured while trying to get user data',
        type: 'danger'
    },
    { // 10
        msg: 'An error occured while trying to get community data',
        type: 'danger'
    },
    {
        msg: 'You successfully joined this community',
        type: 'success'
    },
    {
        msg: 'Location services not allowed',
        type: 'warning',
        link: {
            msg: 'Need help?',
            route: ['./'],
            params: {
                locationHelp: false
            },
            skipChange: true
        }
    },
    {
        msg: 'Google auth failed, try manually logging in',
        type: 'warning'
    },
    {
        msg: 'Failed to upload file',
        type: 'warning'
    }
];

// TODO: make this a class then use the typings or something to create overloads for each alert