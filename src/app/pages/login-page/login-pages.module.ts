import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { LoginPagesRoutingModule } from './login-pages-routing.module';
import { LoginPageComponent } from './login-page.component';

@NgModule({
  imports: [
    CommonModule,
    LoginPagesRoutingModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [LoginPageComponent]
})
export class LoginPagesModule { }
