import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from "./home-page.component";

const routes: Routes = [
    {
        path: '',
        component: HomePageComponent,
        data: {
            title: 'Home'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomePagesRoutingModule { }