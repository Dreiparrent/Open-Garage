import { Component, OnInit, Inject, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../pages/register-page/ragister-validator';
import { CommunityService } from '../../community/community.service';
import { AlertService } from '../../alerts/alert.service';
import { RegisterLocation } from '../../../pages/register-page/register-location';
import { MapsAPILoader } from '@agm/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-create-community-dialog',
  templateUrl: './create-community-dialog.component.html',
  styleUrls: ['./create-community-dialog.component.scss']
})
export class CreateCommunityDialogComponent implements OnInit {

    comFormGroup: FormGroup;
    matcher = new MyErrorStateMatcher();
    location: RegisterLocation;
    locChange = new EventEmitter<string>();
    @ViewChild('locationInput') locationInput: ElementRef<HTMLInputElement>;

    constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreateCommunityDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private comService: CommunityService,
        private authService: AuthService, private mapsAPILoader: MapsAPILoader,
        private alertService: AlertService) { }

    ngOnInit() {
        this.buildform();
        this.mapsAPILoader.load().then(() => {
            this.location = new RegisterLocation(this.alertService, this.locationInput.nativeElement, this.locChange);
        }, err => {
            console.error(err);
            // this.handleLocationError('mapsError');
            }).then(() => {
                this.location.valid.subscribe(valid => {
                    console.log(valid);
                    if (!valid)
                        this.comFormGroup.get('location').setErrors({ valid: true });
                    else {
                        this.comFormGroup.get('location').setErrors(null);
                        this.comFormGroup.get('location').markAsDirty();
                        this.comFormGroup.get('location').updateValueAndValidity();
                        this.locationInput.nativeElement.focus();
                    }
                });
            if (navigator.geolocation)
                this.location.getLocation().then(res => {
                    if (res) {
                        // this.locationInput.nativeElement.dispatchEvent(new Event('place_changed'));
                        this.comFormGroup.get('location').setValue(this.location.name);
                        this.comFormGroup.get('location').markAsDirty();
                    } // else this.handleLocationError('mapsError');
                });
            // else this.handleLocationError('refused');
        });
    }

    buildform() {
        this.comFormGroup = this.fb.group({
            name: ['', Validators.required],
            desc: ['', Validators.required],
            link: ['', [Validators.required, Validators.minLength(3), MyErrorStateMatcher.urlValid()]],
            location: ['', Validators.required]
        });
    }

    getError(child: string, errType: string): boolean {
        const isRequired = this.comFormGroup.get(child).hasError('required');
        /*
        switch (errType) {
            case 'valid'
            this.comService.getUrl()
            default:
            return isRequired;
            break;
        }
        */
        if (errType === 'required')
            return isRequired;
        else
            return isRequired ? false : this.comFormGroup.get(child).hasError(errType);
    }

    getUrl(url: string) {
        if (url)
            this.comService.getUrl(url).then(exists => {
                if (exists)
                    this.comFormGroup.get('link').setErrors({ valid: true });
            });
    }

    locationValid(value: string) {
        this.locChange.emit(value);
    }

    submit() {
        this.comFormGroup.markAsDirty();
        if (this.comFormGroup.valid)
            return {
                name: this.comFormGroup.get('name').value,
                link: this.comFormGroup.get('link').value,
                desc: this.comFormGroup.get('desc').value,
                founder: this.authService.userRef,
                members: 1,
                location: {
                    name: this.location.name,
                    nav: this.location.navigation
                },
                new: true
            };
        else return null;
    }

}
