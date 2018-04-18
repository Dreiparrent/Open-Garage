import { TestBed, inject } from '@angular/core/testing';

import { SwUpdateService } from '../app/sw-update.service';
import { SwUpdate } from '@angular/service-worker';
import { UpdateAvailableEvent } from '@angular/service-worker/src/low_level';
import { of, Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

export interface ISnackTest {
    onAction: () => Observable<void>;
}
/*
@Injectable()
export class StubMatSnack {
    public open(a: string, b: string, c): MatSnackBarRef<SimpleSnackBar> {
        return <MatSnackBarRef<SimpleSnackBar>> {
            onAction: () => new obser
        };
    }
}
*/
describe('SW Update', () => {
    let mockMatSnack;
    beforeEach(() => {
        const mockSwUpdate = {
            get available() { return of(true); }
        };
        mockMatSnack = jasmine.createSpyObj('MatSnackBar', ['open']);
        mockMatSnack.open.and.returnValue(<MatSnackBarRef<SimpleSnackBar>>{
            onAction: () => new Observable<void>()
        });
        TestBed.configureTestingModule({
            providers: [
                SwUpdateService,
                { provide: SwUpdate, useValue: mockSwUpdate },
                { provide: MatSnackBar, useValue: mockMatSnack}
            ]
        });
    });

    it('should be created', inject([SwUpdateService], (service: SwUpdateService) => {
        expect(service).toBeTruthy();
    }));

    it('shoudl prompt update', inject([SwUpdateService], (service: SwUpdateService) => {
        expect(mockMatSnack.open).toHaveBeenCalled();
    }));
});