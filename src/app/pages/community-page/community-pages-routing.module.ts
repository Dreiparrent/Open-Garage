import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityPageComponent } from './community-page.component';

const routes: Routes = [
    {
        path: '',
        component: CommunityPageComponent,
        data: {
            title: 'Community'
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityPagesRoutingModule { }
