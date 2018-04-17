import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunitiesPagesRoutingModule } from './communities-pages-routing.module';
import { CommunitiesPageComponent } from './communities-page.component';
import { Community404Component } from './community-404/community-404.component';
import { MaterialImports } from '../../shared/imports/material-imports.module';

@NgModule({
    imports: [
        CommonModule,
        CommunitiesPagesRoutingModule,
        MaterialImports
    ],
    declarations: [
        CommunitiesPageComponent,
        Community404Component
    ]
})
export class CommunitiesPagesModule { }
