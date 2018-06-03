import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AlertService, Alerts } from '../alerts/alert.service';

@Injectable()
export class AuthGuard implements CanActivate {

    isAuth: boolean;
    lastUrl: string;
    currentAlert;

    constructor(private authService: AuthService, private router: Router, private alertService: AlertService) {
        this.authService.isAuthenticated().subscribe(auth => {
            if (this.isAuth === false && auth === true) {
                this.alertService.removeAlert(this.currentAlert);
                this.router.navigate([this.lastUrl], {
                    skipLocationChange: false
                });
            }
            this.isAuth = auth;
        });
    }
    // canActivate can be a promise;
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.lastUrl = state.url;
        const skipChange = route.queryParams['userSearch'] ? true : false;
        if (this.isAuth)
            return this.isAuth;
        else this.router.navigate(['/home'], {
            skipLocationChange: true
        }).then(res => {
            this.currentAlert = this.alertService.addAlert(Alerts.loginToAccess);
            return res;
        });
    }
}
