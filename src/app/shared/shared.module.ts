import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconGlobe, IconRadio } from 'angular-feather';
import { CommunityGuardService } from './community/community-guard.service';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './navigation/navigation.component';
import { NavigationService } from './navigation/navigation-service';
import { NavButtonComponent } from './navigation/nav-button/nav-button.component';
import { ProfileCardComponent } from './cards/profile-card/profile-card.component';

import { MaterialImports } from './imports/material-imports.module';

const ftIcons = [
    IconGlobe,
    IconRadio
];

@NgModule({
    exports: [
        CommonModule,
        NgbModule,
        NavigationComponent,
        ftIcons,
        ProfileCardComponent,
        NavButtonComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgbModule,
        ftIcons,
        MaterialImports
    ],
    declarations: [
        NavigationComponent,
        ProfileCardComponent,
        NavButtonComponent
    ],
    providers: [
        CommunityGuardService
    ]
})
export class SharedModule { }