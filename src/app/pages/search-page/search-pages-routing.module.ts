import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchPageComponent } from "./search-page.component";

const routes: Routes = [
    {
        path: '',
        component: SearchPageComponent,
        data: {
            title: 'Search'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SearchPagesRoutingModule { }