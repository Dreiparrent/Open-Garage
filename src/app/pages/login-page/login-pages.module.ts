import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { LoginPagesRoutingModule } from './login-pages-routing.module';
import { LoginPageComponent } from './login-page.component';
import { MaterialImports } from '../../shared/imports/material-imports.module';

@NgModule({
    imports: [
        CommonModule,
        LoginPagesRoutingModule,
        MaterialImports
    ],
    declarations: [LoginPageComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPagesModule { }
