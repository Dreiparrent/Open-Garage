import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard.service';
import { ICommunity } from './shared/community/community-interfaces';

import { AppComponent } from './app.component';
import { MainComponent } from './layouts/main/main.component';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { CommunitySidenavComponent } from './pages/community-page/community-sidenav/community-sidenav.component';
import { CommunityService } from './shared/community/community.service';
import { NavigationService } from './shared/navigation/navigation-service';

import { MaterialImports } from './shared/imports/material-imports.module';
import { PopoverModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap';

import * as $ from 'jquery';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SwUpdateService } from './sw-update.service';

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        LoginComponent,
        RegisterComponent,
        CommunitySidenavComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        PopoverModule.forRoot(),
        TooltipModule.forRoot(),
        MaterialImports,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
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
