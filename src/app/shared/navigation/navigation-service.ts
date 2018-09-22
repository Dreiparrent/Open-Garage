import { Injectable } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, mergeMap, switchMap, first } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { IUser } from '../community/community-interfaces';

@Injectable()
export class NavigationService {
    private _isOpen = new BehaviorSubject<boolean>(false);
    get isOpen() {
        return this._isOpen.getValue();
    }
    set isOpen(open: boolean) {
        this._isOpen.next(open);
    }
    previousTab = 0;
    private _currentTab = new BehaviorSubject<number>(0);
    set currentTab(index: number) {
        this.previousTab = this._currentTab.getValue();
        this._currentTab.next(index);
    }
    get currentTab() {
        return this._currentTab.getValue();
    }
    private _navTab = new BehaviorSubject<number>(0);
    set navTab(index: number) {
        this._navTab.next(index);
    }
    get navTab() {
        return this._navTab.getValue();
    }
    private _communityPre = new Subject<boolean>();
    private _communityOpen = new Subject<boolean>();
    private _navProfile = new BehaviorSubject<INavProfile>(null);
    get navProfile() {
        return this._navProfile.asObservable();
    }

    constructor(private authService: AuthService) {
        this.authService.isAuthenticated().subscribe(auth => {
            if (auth)
                this.authService.getUser().then(userResult => {
                    const user = userResult;
                    user.ref = this.authService.userRef;
                    this._navProfile.next({
                        user: user,
                        auth: auth,
                        isProvide: this.authService.userProvider.includes('password')
                    });
                });
        });
    }

    listen(): Observable<boolean> {
        return this._isOpen.asObservable();
    }
    toggle() {
        this.isOpen = !this.isOpen;
    }
    setOpen(isOpen: boolean) {
        this._isOpen.next(isOpen);
    }
    getTab() {
        return this._currentTab.asObservable();
    }
}
interface INavProfile {
    user: IUser;
    auth: boolean;
    isProvide: boolean;
}