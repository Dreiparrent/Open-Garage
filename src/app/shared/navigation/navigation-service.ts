import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavigationService {
    private _isOpen = new Subject<boolean>();
    private _communityPre = new Subject<boolean>();
    private _communityOpen = new Subject<boolean>();

    listen(): Observable<boolean> {
        return this._isOpen.asObservable();
    }
    toggle(isOpen: boolean) {
        this._isOpen.next(isOpen);
    }

    communitySender() {
        this._communityPre.next(true);
    }
    comSenderListen(): Observable<boolean> {
        return this._communityPre.asObservable();
    }
    communityListen(): Observable<any> {
        return this._communityOpen.asObservable();
    }
    toggleCommunity(isOpen: boolean) {
        this._communityOpen.next(isOpen);
    }
}