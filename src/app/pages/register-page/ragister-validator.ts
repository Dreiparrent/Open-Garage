import { FormControl, FormGroupDirective, NgForm, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatChipList } from '@angular/material';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    static matchPassword(fieldName: string) {
        let pass1: FormControl;
        let pass2: FormControl;
        const passMatch = { passMatch: true };
        return function passValid(control: FormControl): { [key: string]: any } {
            if (!control.parent)
                return null;

            if (!pass2) {
                pass2 = control;
                pass1 = control.parent.get(fieldName) as FormControl;

                if (!pass1)
                    throw new Error('matchValidator(): Second control is not found in the parent group!');

                pass1.valueChanges.subscribe(() => {
                    pass2.updateValueAndValidity();
                });
            }

            if (!pass1)
                return null;
            if (pass1.value !== pass2.value)
                return passMatch;
            return null;
        };
    }
    static urlValid() {
        let urlInput: FormControl;
        const urlValid = { urlValid: true };
        const regExp = RegExp(/^([A-Za-z]+((-|_)?([A-Za-z0-9]))+)*$/);
        return function checkUrl(control: FormControl): { [key: string]: any } {
            if (!control)
                return null;
            if (!urlInput)
                urlInput = control;
            console.log(regExp.test(urlInput.value));
            if (!urlInput.value)
                return null;
            if (!regExp.test(urlInput.value))
                return urlValid;
            return null;
        };
    }
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}