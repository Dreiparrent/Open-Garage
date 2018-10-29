import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommunityGuardService } from './community/community-guard.service';
// import { IconsModule } from './imports/icons.module';

import { NavigationComponent } from './navigation/navigation.component';
import { NavigationService } from './navigation/navigation-service';
import { NavButtonComponent } from './navigation/nav-button/nav-button.component';
import { ProfileCardComponent } from './cards/profile-card/profile-card.component';
import { PopoverModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap';

import { MaterialImports } from './imports/material-imports.module';
import { SkillsSliderComponent } from './skills-slider/skills-slider.component';
import { CommunityPathMatcher } from './routes/community-path-matcher';
import { SkillsCardComponent } from './cards/skills-card/skills-card.component';
import { CommunitiesCardComponent } from './cards/communities-card/communities-card.component';
import { MatchHeightDirective } from './directives/match-height.directive';
import { CarouselHeightDirective } from './directives/carousel-height.directive';
import { YourProfileCardComponent } from './cards/your-profile-card/your-profile-card.component';
import { YourProfileDialogComponent } from './cards/your-profile-dialog/your-profile-dialog.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { UpdateProfileDialogComponent } from './cards/update-profile-dialog/update-profile-dialog.component';
import { NavChatComponent } from './navigation/nav-chat/nav-chat.component';
import { AlertsComponent } from './alerts/alerts.component';
import { UserDialogComponent } from './cards/user-dialog/user-dialog.component';
import { ExploreCardComponent } from './cards/explore-card/explore-card.component';
import { AppearDirective } from './directives/appear.directive';
import { NewChatDialogComponent } from './cards/new-chat-dialog/new-chat-dialog.component';
import { ChatComponent } from './community/chat/chat.component';
import { LocationHelpDialogComponent } from './cards/location-help-dialog/location-help-dialog.component';
import { ImageDialogComponent } from './cards/image-dialog/image-dialog.component';
import { CreateCommunityDialogComponent } from './cards/create-community-dialog/create-community-dialog.component';
import { RegisterLocation } from '../pages/register-page/register-location';
import { MobileProfileDialogComponent } from './cards/mobile-profile-dialog/mobile-profile-dialog.component';
import { MobileMessagesDialogComponent } from './cards/mobile-messages-dialog/mobile-messages-dialog.component';
import { UserDialogCardComponent } from './cards/user-dialog-card/user-dialog-card.component';

@NgModule({
    exports: [
        CommonModule,
        NavigationComponent,
        ProfileCardComponent,
        NavButtonComponent,
        SkillsSliderComponent,
        SkillsCardComponent,
        TooltipModule,
        PopoverModule,
        CarouselModule,
        AlertModule,
        CommunitiesCardComponent,
        MatchHeightDirective,
        AppearDirective,
        FormsModule,
        ReactiveFormsModule,
        AlertsComponent,
        ExploreCardComponent,
        ChatComponent,
        UserDialogCardComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        MaterialImports,
        TooltipModule,
        PopoverModule,
        CarouselModule.forRoot(),
        AlertModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        // IconsModule
    ],
    declarations: [
        NavigationComponent,
        ProfileCardComponent,
        NavButtonComponent,
        SkillsSliderComponent,
        SkillsCardComponent,
        CommunitiesCardComponent,
        MatchHeightDirective,
        AppearDirective,
        YourProfileCardComponent,
        YourProfileDialogComponent,
        UpdateProfileDialogComponent,
        NavChatComponent,
        AlertsComponent,
        UserDialogComponent,
        ExploreCardComponent,
        NewChatDialogComponent,
        ChatComponent,
        LocationHelpDialogComponent,
        ImageDialogComponent,
        CreateCommunityDialogComponent,
        MobileProfileDialogComponent,
        MobileMessagesDialogComponent,
        UserDialogCardComponent
    ],
    entryComponents: [
        YourProfileDialogComponent,
        UpdateProfileDialogComponent,
        UserDialogComponent,
        ImageDialogComponent,
        NewChatDialogComponent,
        LocationHelpDialogComponent,
        CreateCommunityDialogComponent,
        MobileProfileDialogComponent,
        MobileMessagesDialogComponent
    ],
    providers: [
        CommunityGuardService,
        CommunityPathMatcher,
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
        { provide: MAT_CHIPS_DEFAULT_OPTIONS, useValue: { separatorKeyCodes: [ENTER, COMMA, '186'] } }
    ]
})
export class SharedModule { }