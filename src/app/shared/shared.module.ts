import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IconGlobe, IconRadio } from "angular-feather";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './navigation/navigation.component';
import { ProfileCardComponent } from './cards/profile-card/profile-card.component';

const ftIcons = [
    IconGlobe,
    IconRadio
]

@NgModule({
    exports: [
        CommonModule,
        NgbModule,
        NavigationComponent,
        ftIcons,
        ProfileCardComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgbModule,
        MatIconModule,
        ftIcons,
        MatButtonModule
    ],
    declarations: [
        NavigationComponent,
        ProfileCardComponent
    ]
})
export class SharedModule { }