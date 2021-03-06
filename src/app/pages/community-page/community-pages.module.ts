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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommunitySearchComponent } from './community-search/community-search.component';

@NgModule({
    imports: [
        CommonModule,
        CommunityPagesRoutingModule,
        SharedModule,
        LayoutModule,
        MaterialImports,
        NgxCarouselModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        CommunityPageComponent,
        CommunityJumbotronComponent,
        CommunityCardComponent,
        CommunityMembersComponent,
        CommunitySkillsComponent,
        CarouselHeightDirective,
        CommunitySearchComponent
    ],
    providers: []
})
export class CommunityPagesModule { }
