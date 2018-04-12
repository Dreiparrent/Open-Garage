import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunitiesPageComponent } from './communities-page.component';
import { Community404Component } from './community-404/community-404.component';

const routes: Routes = [
    {
        path: '',
        component: CommunitiesPageComponent,
        data: {
            title: 'Communities'
        }
    },
    {
        path: '404',
        component: Community404Component,
        data: {
            title: 'Communities'
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunitiesPagesRoutingModule { }
