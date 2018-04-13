import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterPagesRoutingModule } from './register-pages-routing.module';
import { RegisterPageComponent } from './register-page.component';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        RegisterPagesRoutingModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        SharedModule
    ],
    declarations: [RegisterPageComponent]
})
export class RegisterPagesModule { }
