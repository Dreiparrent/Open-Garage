import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityPagesRoutingModule } from './community-pages-routing.module';
import { CommunityPageComponent } from './community-page.component';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialImports } from '../../shared/imports/material-imports.module';
import { CommunityJumbotronComponent } from './community-jumbotron/community-jumbotron.component';
import { CommunityCardComponent } from './community-card/community-card.component';
import { CommunityMembersComponent } from './community-members/community-members.component';

@NgModule({
    imports: [
        CommonModule,
        CommunityPagesRoutingModule,
        SharedModule,
        LayoutModule,
        MaterialImports
    ],
    declarations: [
        CommunityPageComponent,
        CommunityJumbotronComponent,
        CommunityCardComponent,
        CommunityMembersComponent
    ],
    providers: [ ]
})
export class CommunityPagesModule { }
