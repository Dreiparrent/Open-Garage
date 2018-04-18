import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { UpdateAvailableEvent } from '@angular/service-worker/src/low_level';
import { interval } from 'rxjs';

@Injectable()
export class SwUpdateService {
    constructor(private updates: SwUpdate, private snackBar: MatSnackBar) {
        this.updates.available.subscribe(event => {
            this.openSnackBar();
        });
    }

    openSnackBar() {
        const snackSub = this.snackBar.open('A new update is pending', 'reload', {
            duration: 5000
        });
        snackSub.onAction().subscribe(() => {
            this.updates.activateUpdate().then(() => document.location.reload());
        });
    }
}