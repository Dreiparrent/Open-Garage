import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommunityGuardService } from './community/community-guard.service';
// import { IconsModule } from './imports/icons.module';

import { NavigationComponent } from './navigation/navigation.component';
import { NavigationService } from './navigation/navigation-service';
import { NavButtonComponent } from './navigation/nav-button/nav-button.component';
import { ProfileCardComponent } from './cards/profile-card/profile-card.component';
import { PopoverModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap';

import { MaterialImports } from './imports/material-imports.module';
import { SkillsSliderComponent } from './skills-slider/skills-slider.component';
import { CommunityPathMatcher } from './routes/community-path-matcher';
import { SkillsCardComponent } from './cards/skills-card/skills-card.component';

@NgModule({
    exports: [
        CommonModule,
        NavigationComponent,
        ProfileCardComponent,
        NavButtonComponent,
        SkillsSliderComponent,
        SkillsCardComponent,
        TooltipModule,
        PopoverModule
    ],
    imports: [
        RouterModule,
        CommonModule,
        MaterialImports,
        TooltipModule,
        PopoverModule
        // IconsModule
    ],
    declarations: [
        NavigationComponent,
        ProfileCardComponent,
        NavButtonComponent,
        SkillsSliderComponent,
        SkillsCardComponent
    ],
    providers: [
        CommunityGuardService,
        CommunityPathMatcher
    ]
})
export class SharedModule { }