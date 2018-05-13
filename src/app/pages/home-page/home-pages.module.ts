import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HomePagesRoutingModule } from './home-pages-routing.module';
import { HomePageComponent } from './home-page.component';
import { SharedModule } from '../../shared/shared.module';
import { MaterialImports } from '../../shared/imports/material-imports.module';

@NgModule({
    imports: [
        CommonModule,
        HomePagesRoutingModule,
        SharedModule,
        MaterialImports,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        HomePageComponent
    ]
})
export class HomePagesModule { }