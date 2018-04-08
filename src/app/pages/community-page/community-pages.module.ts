import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityPagesRoutingModule } from './community-pages-routing.module';
import { CommunityPageComponent } from './community-page.component';

import { SharedModule } from '../../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommunityService } from '../../shared/community/community.service';


@NgModule({
    imports: [
        CommonModule,
        CommunityPagesRoutingModule,
        SharedModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSlideToggleModule
    ],
    declarations: [
        CommunityPageComponent
    ],
    providers: [
        CommunityService
    ]
})
export class CommunityPagesModule { }
