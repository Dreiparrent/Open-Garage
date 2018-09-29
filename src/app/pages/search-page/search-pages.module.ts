import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SearchPagesRoutingModule } from './search-pages-routing.module';
import { SearchPageComponent } from './search-page.component';
import { CommunitiesService } from '../../shared/community/communities.service';
import { MaterialImports } from '../../shared/imports/material-imports.module';
import { Search404Component } from './search-404/search-404.component';

@NgModule({
    imports: [
        CommonModule,
        SearchPagesRoutingModule,
        SharedModule,
        MaterialImports
    ],
    declarations: [
        SearchPageComponent,
        Search404Component
    ],
    providers: [
        CommunitiesService
    ]
})
export class SearchPagesModule { }