import { Component, OnInit, Inject } from '@angular/core';
import { MyErrorStateMatcher } from '../../../pages/register-page/ragister-validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IUser } from '../../community/community-interfaces';

@Component({
  selector: 'app-update-profile-dialog',
  templateUrl: './update-profile-dialog.component.html',
  styleUrls: ['./update-profile-dialog.component.scss']
})
export class UpdateProfileDialogComponent implements OnInit {

    payments: string[] = [];
    profilePayments: string[] = [];
    matcher = new MyErrorStateMatcher();
    uFormGroup: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<UpdateProfileDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public profile: IUser) {
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.uFormGroup = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            pass1: ['', [Validators.minLength(6)]],
            pass2: ['', [Validators.minLength(6), MyErrorStateMatcher.matchPassword('pass1')]]
        });
    }

    getError(child: string, errType: string): boolean {
        const isRequired = this.uFormGroup.get(child).hasError('required');
        if (errType === 'required')
            return isRequired;
        else
            return isRequired ? false : this.uFormGroup.get(child).hasError(errType);
    }

    closeDialog() {
        this.dialogRef.close('test');
    }

    submitRegister(formValue) {
        // TODO: add close
    }
}
