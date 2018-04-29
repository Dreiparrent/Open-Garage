// import { BrowserModule } from '@angular/platform-browser';
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
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
/*import { NgxImportsModule } from './shared/imports/ngx-imports.module';*/

import * as $ from 'jquery';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SwUpdateService } from './sw-update.service';

<<<<<<< HEAD
// import { AgmCoreModule } from '@agm/core';
// import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
=======
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
>>>>>>> a318778de48355fce8f0c7dbc2119aae429c540a

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        CommunitySidenavComponent,
        MainComponent
    ],
    imports: [
        // BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        MaterialImports,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
<<<<<<< HEAD
        // NgxImportsModule,
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
=======
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyARGMZgt5yZG663ImbWcvs3Qu0-kSRS-o8'
        }),
        AgmSnazzyInfoWindowModule
>>>>>>> a318778de48355fce8f0c7dbc2119aae429c540a
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
