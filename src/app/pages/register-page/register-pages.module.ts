import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterPagesRoutingModule } from './register-pages-routing.module';
import { RegisterPageComponent } from './register-page.component';

import { SharedModule } from '../../shared/shared.module';
import { MaterialImports } from '../../shared/imports/material-imports.module';
import { RegisterService } from './register.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';


@NgModule({
    imports: [
        CommonModule,
        RegisterPagesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        MaterialImports
    ],
    declarations: [RegisterPageComponent],
    providers: [RegisterService]
})
export class RegisterPagesModule { }
