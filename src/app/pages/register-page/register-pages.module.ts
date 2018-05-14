import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterPagesRoutingModule } from './register-pages-routing.module';
import { RegisterPageComponent } from './register-page.component';

import { SharedModule } from '../../shared/shared.module';
import { MaterialImports } from '../../shared/imports/material-imports.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';


@NgModule({
    imports: [
        CommonModule,
        RegisterPagesRoutingModule,
        SharedModule,
        MaterialImports
    ],
    declarations: [RegisterPageComponent],
    providers: [
        { provide: MAT_CHIPS_DEFAULT_OPTIONS, useValue: { separatorKeyCodes: [ENTER, COMMA, '186'] } }
    ]
})
export class RegisterPagesModule { }
