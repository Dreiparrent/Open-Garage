import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchPageComponent } from './search-page.component';
import { Search404Component } from './search-404/search-404.component';

const routes: Routes = [
    {
        path: '',
        component: SearchPageComponent,
        data: {
            title: 'Search'
        }
    },
    {
        path: '404',
        component: Search404Component
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SearchPagesRoutingModule { }