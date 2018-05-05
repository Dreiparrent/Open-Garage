import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunitiesPagesRoutingModule } from './communities-pages-routing.module';
import { CommunitiesPageComponent } from './communities-page.component';
import { Community404Component } from './community-404/community-404.component';
import { MaterialImports } from '../../shared/imports/material-imports.module';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { CommunitiesService } from '../../shared/community/communities.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        CommunitiesPagesRoutingModule,
        MaterialImports,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyARGMZgt5yZG663ImbWcvs3Qu0-kSRS-o8'
        }),
        AgmSnazzyInfoWindowModule,
        SharedModule
    ],
    declarations: [
        CommunitiesPageComponent,
        Community404Component
    ],
    providers: [
        CommunitiesService
    ]
})
export class CommunitiesPagesModule { }
