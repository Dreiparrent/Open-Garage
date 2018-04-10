import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard.service';
import { ICommunity } from './shared/community/community-interfaces';

import { AppComponent } from './app.component';
import { HomeComponent } from './layouts/home/home.component';
import { SearchComponent } from './layouts/search/search.component';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { CommunityComponent } from './layouts/community/community.component';
import { CommunitySidenavComponent } from './pages/community-page/community-sidenav/community-sidenav.component';
import { CommunityService } from './shared/community/community.service';
import { NavigationService } from './shared/navigation/navigation-service';

import { MaterialImports } from './shared/imports/material-imports.module';

import * as $ from 'jquery';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SearchComponent,
        LoginComponent,
        RegisterComponent,
        CommunityComponent,
        CommunitySidenavComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        NgbModule.forRoot(),
        MaterialImports
    ],
    providers: [
        AuthService,
        AuthGuard,
        NavigationService,
        CommunityService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
