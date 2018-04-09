import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavigationService {
    private _isOpen = new Subject<boolean>();

    listen(): Observable<any> {
        return this._isOpen.asObservable();
    }

    toggle(isOpen: boolean) {
        this._isOpen.next(isOpen);
    }

}