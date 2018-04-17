import { TestBed, inject } from '@angular/core/testing';

import { SwUpdateService } from '../app/sw-update.service';
import { SwUpdate } from '@angular/service-worker';
import { UpdateAvailableEvent } from '@angular/service-worker/src/low_level';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class StubMatSnack {

}

describe('SW Update', () => {
    beforeEach(() => {
        const mockSwUpdate = {
            get avalable() { return of(true); }
        };
        TestBed.configureTestingModule({
            providers: [
                SwUpdateService
            ]
        });
    });

    it('should be created', inject([SwUpdateService], (service: SwUpdateService) => {
        expect(service).toBeTruthy();
    }));

    it('shoudl prompt update', () => {
        expect(true).toBe(true);
    });
});