import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunitiesPagesRoutingModule } from './communities-pages-routing.module';
import { CommunitiesPageComponent } from './communities-page.component';
import { MaterialImports } from '../../shared/imports/material-imports.module';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { CommunitiesService } from '../../shared/community/communities.service';
import { SharedModule } from '../../shared/shared.module';
import { CommunitiesMapComponent } from './communities-map/communities-map.component';
import { CommunitiesSearchComponent } from './communities-search/communities-search.component';
import { AgmCoreModule } from '../../../../node_modules/@agm/core';

@NgModule({
    imports: [
        CommonModule,
        CommunitiesPagesRoutingModule,
        MaterialImports,
        AgmCoreModule,
        AgmSnazzyInfoWindowModule,
        SharedModule
    ],
    declarations: [
        CommunitiesPageComponent,
        CommunitiesMapComponent,
        CommunitiesSearchComponent
    ],
    providers: [
        CommunitiesService
    ]
})
export class CommunitiesPagesModule { }
