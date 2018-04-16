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
import { CommunitySkillsComponent } from './community-skills/community-skills.component';
import { NgxCarouselModule } from 'ngx-carousel';
import { CarouselHeightDirective } from '../../shared/directives/carousel-height.directive';
import { MatchHeightDirective } from '../../shared/directives/match-height.directive';

@NgModule({
    imports: [
        CommonModule,
        CommunityPagesRoutingModule,
        SharedModule,
        LayoutModule,
        MaterialImports,
        NgxCarouselModule
    ],
    declarations: [
        CommunityPageComponent,
        CommunityJumbotronComponent,
        CommunityCardComponent,
        CommunityMembersComponent,
        CommunitySkillsComponent,
        CarouselHeightDirective,
        MatchHeightDirective
    ],
    providers: []
})
export class CommunityPagesModule { }
