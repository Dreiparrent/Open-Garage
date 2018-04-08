import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IconGlobe, IconRadio } from 'angular-feather';
import { CommunityService } from './community/community.service';
import { CommunityGuardService } from './community/community-guard.service';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './navigation/navigation.component';
import { ProfileCardComponent } from './cards/profile-card/profile-card.component';

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
        ProfileCardComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgbModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        ftIcons
    ],
    declarations: [
        NavigationComponent,
        ProfileCardComponent
    ],
    providers: [CommunityService, CommunityGuardService]
})
export class SharedModule { }