import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunitiesPagesRoutingModule } from './communities-pages-routing.module';
import { CommunitiesPageComponent } from './communities-page.component';

@NgModule({
    imports: [
        CommonModule,
        CommunitiesPagesRoutingModule
    ],
    declarations: [
        CommunitiesPageComponent
    ]
})
export class CommunitiesPagesModule { }
