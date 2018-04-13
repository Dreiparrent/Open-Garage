import { FormControl, FormGroupDirective, NgForm, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    static matchPassword(fieldName: string) {
        let pass1: FormControl;
        let pass2: FormControl;
        const passMatch = { passMatch: true };
        return function passValid(control: FormControl): { [key: string]: any } {
            if (!control.parent)
                return null;

            if (!pass1) {
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
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}