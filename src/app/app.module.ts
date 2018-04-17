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
import { CommunitiesComponent } from './layouts/communities/communities.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SwUpdateService } from './sw-update.service';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SearchComponent,
        LoginComponent,
        RegisterComponent,
        CommunityComponent,
        CommunitySidenavComponent,
        CommunitiesComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        NgbModule.forRoot(),
        MaterialImports,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        AuthService,
        AuthGuard,
        NavigationService,
        CommunityService,
        SwUpdateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
