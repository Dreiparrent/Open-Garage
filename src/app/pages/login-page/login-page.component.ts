import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { auth } from 'firebase/app';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { MatInput } from '@angular/material';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { MyErrorStateMatcher } from '../register-page/ragister-validator';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

    matcher = new MyErrorStateMatcher();
    lFormGroup: FormGroup;
    _loginError = false;
    email: AbstractControl;
    password: AbstractControl;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {

    }

    ngOnInit() {
        this.lFormGroup = this.fb.group({
            email: ['', [Validators.required, Validators.email, this.loginError.bind(this)]],
            password: ['', [Validators.required, this.loginError.bind(this)]]
        });
        this.email = this.lFormGroup.get('email');
        this.password = this.lFormGroup.get('password');
        this.password.valueChanges.subscribe(() => this._loginError = false);
    }

    loginError(control: AbstractControl): ValidationErrors {
        return this._loginError ? { loginError: true } : null;
    }
    valueChange() {
        this._loginError = false;
        this.password.updateValueAndValidity();
    }

    onLogin() {
        this.email.markAsTouched();
        this.password.markAsTouched();
        if (!this.email.valid || !this.password.valid) {
            console.log('invalid');
            return;
        }
        this.authService.signinUser(this.email.value, this.password.value).then(result => {
            console.log(result);
            if (result)
                this.reload();
            else {
                this._loginError = true;
                this.password.updateValueAndValidity();
            }
        });
    }

    markInputs(): AbstractControl[] {
        const email = this.lFormGroup.get('email');
        const pass = this.lFormGroup.get('password');
        email.markAsTouched();
        pass.markAsTouched();
        return [email, pass];
    }

    fAuth() {
        this.authService.fAuth().then(result => {
            console.log(result);
        });
    }
    gAuth() {
        this.authService.gAuth().then(result => {
            if (result)
                this.reload();
            else
                console.log('error');
        });
    }

    private reload() {
        this.router.navigate(['/home'], {
            queryParams: {
                login: true
            }
        }).then(res => {
            this.router.navigate(['/'], {
                skipLocationChange: true,
                queryParams: {
                    reload: true
                }
            });
        });
    }

}
