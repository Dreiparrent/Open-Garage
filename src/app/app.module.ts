import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from "./shared/shared.module";

import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './layouts/home/home.component'; 

import * as $ from 'jquery';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    NgbModule.forRoot()
  ],
  providers: [
      AuthService,
      AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
