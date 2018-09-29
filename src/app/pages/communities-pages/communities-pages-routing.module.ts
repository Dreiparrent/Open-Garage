import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunitiesPageComponent } from './communities-page.component';

const routes: Routes = [
    {
        path: '',
        component: CommunitiesPageComponent,
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
