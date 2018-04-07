import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SearchPagesRoutingModule } from "./search-pages-routing.module"
import { SearchPageComponent } from "./search-page.component";

@NgModule({
    imports: [
        CommonModule,
        SearchPagesRoutingModule,
        SharedModule,
        MatFormFieldModule,
        MatInputModule
    ],
    declarations: [
        SearchPageComponent
    ]
})
export class SearchPagesModule { }