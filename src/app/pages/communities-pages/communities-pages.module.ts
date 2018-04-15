import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunitiesPagesRoutingModule } from './communities-pages-routing.module';
import { CommunitiesPageComponent } from './communities-page.component';
import { Community404Component } from './community-404/community-404.component';

@NgModule({
    imports: [
        CommonModule,
        CommunitiesPagesRoutingModule
    ],
    declarations: [
        CommunitiesPageComponent,
        Community404Component
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommunitiesPagesModule { }
