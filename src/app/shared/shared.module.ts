import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { MatIconModule } from '@angular/material/icon';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
    exports: [
        CommonModule,
        NgbModule,
        NavigationComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgbModule,
        MatIconModule
    ],
    declarations: [
        NavigationComponent
    ]
})
export class SharedModule { }