import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { MyErrorStateMatcher } from './ragister-validator';
import { MatChipInputEvent, MatChipList, MatChipListChange, MatSelect, MatOption } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { AuthService, IRegister } from '../../shared/auth/auth.service';
import { Payments, INavigation } from '../../shared/community/community-interfaces';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase';
import { AlertService, Alerts, IAlert } from '../../shared/alerts/alert.service';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { RegisterLocation } from './register-location';
import { environment } from '../../../environments/environment';
// declare var google: any;
/*
import { } from '@types/googlemaps';
*/
// import {} from 'googlemaps';
@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, AfterViewInit {
    payments: string[] = [];
    popovers = {
        skills: `What can you help people with? Look, you don't have to be certified or have a gold medal to
         help someone out. We're just looking for something you know a lot about.
         Do you......cook? Run? Knit? Read about bitcoin? Build bikes? Follow fashion trends?
         Responsibly manage your finances? Meditate? Sketch? Take wicked photographs? Code? Wax your own
         skis? Maintenance your own car? I think you get the idea....`,
        passions: `What do you daydream about at work? What do you spend your weekends doing in your garage?`,
        payment: `What will you charge your community for sharing your knowledge? (quantity dependent on extent of knowledge shared)`,
        about: `Who are you? What's your fun fact? What should your community know about you?`,
        photo: `We believe that each profile needs a face`
    };

    // Elements and variables
    @ViewChild('locationInput') locationInput: ElementRef<HTMLInputElement>;
    @ViewChild('skillsList') skillsList: MatChipList;
    @ViewChild('passionsList') passionsList: MatChipList;
    inputSkills: string[] = [];
    inputPassions: string[] = [];

    // Errors
    userExists = -1;
    matcher = new MyErrorStateMatcher();
    rFormGroup: FormGroup;
    authType = 0;
    steps;

    // Navigation
    location: RegisterLocation;
    locChange = new EventEmitter<string>();
//#region Init
    constructor(private fb: FormBuilder, private authService: AuthService,
        private alertService: AlertService, private mapsAPILoader: MapsAPILoader, private route: ActivatedRoute) {
        for (const i in Payments)
            if (typeof Payments[i] === 'string')
                this.payments.push(Payments[i]);
    }

    /* start form and steps
    * Create steps
    * Check for auth
    */
    ngOnInit() {
        this.buildForm();
        this.createSteps();
        this.route.queryParams.subscribe(params => {
            if (params['incomplete']) {
                console.log(this.authService.userProvider);
                // if (this.authService.userProvider.includes('password'))
                if (this.authService.userProvider.includes('google.com')) {
                    this.authType = 2;
                    this.authService.isAuth = true;
                } else if (this.authService.userProvider.includes('facebook')) { // TODO: this is not 'facebook'
                    this.authType = 3;
                    this.authService.isAuth = true;
                }
                $('.icons-tab-steps').steps('next');
            }
        });
    }

    // For passions and skills chips
    ngAfterViewInit() {
        this.skillsList.chips.changes.subscribe(() => {
            if (this.skillsList.empty)
                this.rFormGroup.get('skills').setErrors({ required: true });
            // this.skills.setErrors({ required: true });
        });
        this.passionsList.chips.changes.subscribe(() => {
            if (this.passionsList.empty)
                this.rFormGroup.get('passions').setErrors({ required: true });
            // this.passions.setErrors({ required: true });
        });
    }
//#endregion
//#region Form
    buildForm() {
        this.rFormGroup = this.fb.group({
            // Step 1
            email: ['', [Validators.required, Validators.email]],
            pass1: ['', [Validators.required, Validators.minLength(6)]],
            pass2: ['', [Validators.required, Validators.minLength(6), MyErrorStateMatcher.matchPassword('pass1')]],
            // Step 2
            fName: ['', Validators.required],
            lName: ['', Validators.required],
            location: ['', Validators.required],
            // Step 3
            skills: '',
            passions: '',
            payment: ['', Validators.required],
            // Step 4
            about: ['', Validators.required],
            photo: ['', Validators.required]
        });
    }
    // Get form error
    getError(child: string, errType: string): boolean {
        const isRequired = this.rFormGroup.get(child).hasError('required');
        if (errType === 'required')
            return isRequired;
        else
            return isRequired ? false : this.rFormGroup.get(child).hasError(errType);
    }
//#endregion
//#region Auth Check
    fAuth($event) {
        $event.preventDefault();
        // this.authType = 1;
        $('.icons-tab-steps').steps('next');
    }

    gAuth($event) {
        console.log('gAuth');
        $event.preventDefault();
        this.authService.gAuth().then(result => {
            if (result) {
                this.authType = 2;
                $('.icons-tab-steps').steps('next');
            }
        });
    }
//#endregion
//#region Steps
    createSteps() {
        $('.icons-tab-steps').steps({
            headerTag: 'h6',
            bodyTag: 'fieldset',
            transitionEffect: 'fade',
            titleTemplate: '<span class="step">#index#</span> #title#',
            preloadContent: true,
            labels: {
                finish: 'Submit'
            },
            onInit: (event, currentIndex) => {
                this.mapsAPILoader.load().then(() => {
                    this.location = new RegisterLocation(this.alertService, this.locationInput.nativeElement, this.locChange);
                }, err => {
                    console.error(err);
                    // this.handleLocationError('mapsError');
                    }).then(() => {
                        this.location.valid.subscribe(valid => {
                            console.log(valid);
                            if (!valid)
                                this.formChildren('location').setErrors({ invalid: true });
                            else {
                                this.formChildren('location').setErrors(null);
                                this.formChildren('location').markAsDirty();
                                this.formChildren('location').updateValueAndValidity();
                                this.locationInput.nativeElement.focus();
                            }
                        });
                        if (navigator.geolocation)
                            this.location.getLocation().then(res => {
                                if (res) {
                                    // this.locationInput.nativeElement.dispatchEvent(new Event('place_changed'));
                                    this.formChildren('location').setValue(this.location.name);
                                    this.formChildren('location').markAsDirty();
                                } else this.handleLocationError('mapsError');
                            });
                        else this.handleLocationError('refused');
                    });
            },
            onStepChanging: (event, currentIndex, newIndex) => {
                if (currentIndex > newIndex)
                    return true;
                if (newIndex < 4 && !environment.production)
                    return true;
                switch (newIndex) {
                    case 1:
                        if (this.authType === 0) {
                            this.formChildren('email').markAsDirty();
                            this.formChildren('pass1').markAsDirty();
                            this.formChildren('pass2').markAsDirty();
                            if (this.formChildren('email').valid && this.formChildren('pass1').valid && this.formChildren('pass2').valid) {
                                this.authService.userExists(this.formChildren('email').value).then(doesExist => {
                                    if (doesExist) {
                                        this.userExists = 1;
                                        this.alertService.addAlert(Alerts.incomplete, true);
                                    } else this.userExists = 0;
                                });
                                return true;
                            } else return false;
                        } else
                            return this.authService.isAuth;
                            // */
                    case 2:
                        this.formChildren('fName').markAsDirty();
                        this.formChildren('lName').markAsDirty();
                        this.formChildren('location').markAsDirty();
                        if (this.formChildren('fName').valid && this.formChildren('lName').valid && this.formChildren('location').value)
                            return this.checkLocation();
                        return false;
                    case 3:
                        if (!this.formChildren('skills').dirty)
                            this.formChildren('skills').setErrors({ required: true });
                        if (!this.formChildren('pasions').dirty)
                            this.formChildren('pasions').setErrors({ required: true });
                        this.formChildren('payment').markAsDirty();
                        return this.formChildren('skills').valid &&
                            this.formChildren('pasions').valid &&
                            this.formChildren('payment').valid;
                }
            },
            onFinishing: (event, currentIndex) => {
                this.formChildren('about').markAsDirty();
                return this.formChildren('about').valid;
            },
            onFinished: (event, currentIndex) => this.submitRegister(this.rFormGroup.value)
        });
    }
//#endregion

    handleLocationError(type: ILocationErrors): boolean {
        switch (type) {
            case 'refused':
                this.alertService.addAlert(Alerts.locationError, false);
                break;
            case 'registered':
                this.alertService.addAlert(Alerts.locationError, true);
                break;
            case 'invalid':
                this.formChildren('location').setErrors({ invalid: true });
                break;
            case 'valid':
                this.formChildren('location').setErrors({ invalid: false });
                break;
        }
        return true;
        // TODO: this
        /*
        if (this.locationRefused) {
            if (this.locationAlert) {
                this.alertService.removeAlert(this.locationAlert);
                this.locationAlert = null;
            }
            return true;
        } else this.locationAlert = this.alertService.addAlert(Alerts.locationError, true);
        return false;
        */
    }

    checkLocation() {
        if (this.location.valid) {
            this.handleLocationError('valid');
            return true;
        } else {
            this.handleLocationError('invalid');
            return false;
        }
    }

    formChildren(id: IFormChildren): AbstractControl {
        return this.rFormGroup.get(FormChildren[id]);
    }

    locationCheck(value: string) {
        this.locChange.emit(value);
    }
//#region chips

    addChip(event: MatChipInputEvent, type: number): void {
        const input = event.input;
        const value = event.value;

        // console.log(this.skills.value);
        if ((value || '').trim())
            if (type)
                this.inputPassions.push(value.trim());
            else
                this.inputSkills.push(value.trim());
        if (input)
            input.value = '';
    }

    removeChip(chip: any, isPassion = false): void {
        // let inputList;
        console.log(chip, isPassion);
        const index = isPassion ? this.inputPassions.indexOf(chip) : this.inputSkills.indexOf(chip);
        if (index >= 0)
            if (isPassion)
                this.inputPassions.splice(index, 1);
            else
                this.inputSkills.splice(index, 1);
        console.log(index, this.inputPassions);
    }
//#endregion
//#region Submit
    submitRegister(formValues) {
        if (this.authType >= 0) {
            const isValid = this.rFormGroup.valid;
            const fPayments: number[] = [];
            formValues.payment.forEach((payment: string) => {
                fPayments.push(Payments[payment]);
            });
            const register: IRegister = {
                type: this.authType,
                fName: formValues.fName,
                lName: formValues.lName,
                location: this.location.name,
                latlng: this.location.latlng,
                skills: this.inputSkills,
                passions: this.inputPassions,
                payment: fPayments,
                about: formValues.about,
                photo: formValues.photo // TODO: here
            };
            if (this.authType === 0) {
                register.email = formValues.email;
                register.pass = formValues.pass1;
            }
            console.log(register);
            if (isValid)
                this.authService.registerUser(register);
        } else this.alertService.addAlert(Alerts.userError);
    }
//#endregion
}
enum FormChildren {
    email = 'email',
    pass1 = 'pass1',
    pass2 = 'pass2',
    fName = 'fName',
    lName = 'lName',
    location = 'location',
    skills = 'skills',
    pasions = 'passions',
    payment = 'payment',
    about = 'about'
}
declare type IFormChildren =
    FormChildren |
    'email' |
    'pass1' |
    'pass2' |
    'fName' |
    'lName' |
    'location' |
    'skills' |
    'pasions' |
    'payment' |
    'about';
enum LocationErrors { 'refused', 'mapsError', 'registered', 'invalid' , 'valid'}
declare type ILocationErrors = LocationErrors | 'refused' | 'mapsError' | 'registered' | 'invalid' | 'valid';