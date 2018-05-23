import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';


import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
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
import { CommunitiesComponent } from './layouts/communities/communities.component';

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        LoginComponent,
        RegisterComponent,
        CommunitySidenavComponent,
        CommunitiesComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        PopoverModule.forRoot(),
        TooltipModule.forRoot(),
        MaterialImports,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule
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
