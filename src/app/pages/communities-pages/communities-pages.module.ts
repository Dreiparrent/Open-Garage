import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunitiesPagesRoutingModule } from './communities-pages-routing.module';
import { CommunitiesPageComponent } from './communities-page.component';
import { Community404Component } from './community-404/community-404.component';
import { MaterialImports } from '../../shared/imports/material-imports.module';
import { AgmCoreModule } from '@agm/core';
<<<<<<< HEAD
// import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
=======
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
>>>>>>> a318778de48355fce8f0c7dbc2119aae429c540a

@NgModule({
    imports: [
        CommonModule,
        CommunitiesPagesRoutingModule,
        MaterialImports,
<<<<<<< HEAD
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyARGMZgt5yZG663ImbWcvs3Qu0-kSRS-o8'
        }),
        // AgmSnazzyInfoWindowModule
=======
        AgmCoreModule,
        AgmSnazzyInfoWindowModule
>>>>>>> a318778de48355fce8f0c7dbc2119aae429c540a
    ],
    declarations: [
        CommunitiesPageComponent,
        Community404Component
    ]
})
export class CommunitiesPagesModule { }
