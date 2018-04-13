import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MyErrorStateMatcher } from './ragister-validator';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
    payments: string[] = [
        'Nothing, happy to help',
        'Pizza',
        'Tacos',
        'Beer (must be 21)',
        'Wine (must be 21)',
        'Cash'
    ];

    popovers = {
        skills: `What can you help people with? Look, you don't have to be certified or have a gold medal to
         help someone out. We're just looking for something you know a lot about.
         Do you......cook? Run? Knit? Read about bitcoin? Build bikes? Follow fashion trends?
         Responsibly manage your finances? Meditate? Sketch? Take wicked photographs? Code? Wax your own
         skis? Maintenance your own car? I think you get the idea....`,
        passions: `What do you daydream about at work? What do you spend your weekends doing in your garage?`,
        payment: `What will you charge your community for sharing your knowledge? (quantity dependent on extent of knowledge shared)`,
        about: `Who are you? What's your fun fact? What should your community know about you?`
    };

    // Step 1
    email = new FormControl('', [Validators.required, Validators.email]);
    pass1 = new FormControl('', [Validators.required, Validators.minLength(6)]);
    pass2 = new FormControl('', [Validators.required, Validators.minLength(6), MyErrorStateMatcher.matchPassword('pass1')]);
    // Step 2
    name = new FormControl('', [Validators.required]);
    location = new FormControl('', [Validators.required]);
    // Step 3
    skills = new FormControl('', [Validators.required]);
    passions = new FormControl('', [Validators.required]);
    payment = new FormControl('', [Validators.required]);
    // Step 4
    about = new FormControl('', [Validators.required]);

    formGroup = new FormGroup({
        // Step 1
        email: this.email,
        pass1: this.pass1,
        pass2: this.pass2,
        // Step 2
        name: this.name,
        location: this.location,
        // Step 3
        skills: this.skills,
        passions: this.passions,
        payment: this.payment,
        // Step 4
        about: this.about
    });

    matcher = new MyErrorStateMatcher();

    constructor(fb: FormBuilder) {
    }

    ngOnInit() {
        this.createSteps();
    }

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
                // test
            },
            onStepChanging: (event, currentIndex, newIndex) => {
                if (currentIndex > newIndex)
                    return true;
                switch (newIndex) {
                    case 1:
                        return this.email.valid && this.pass1.valid && this.pass2.valid;
                    case 2:
                        return this.name.valid && this.location.valid;
                    case 3:
                        return this.skills.valid && this.passions.valid && this.payment.valid;
                }
            },
            onFinished: function (event, currentIndex) {
                alert('Form submitted.');
            }
        });
    }

    submitRegister(data: any) {
        console.log(data);
    }

}
interface IRegister {
    // Step 1
    email: string;
    pass1: string;
    pass2: string;
    // Step 2
    name: string;
    location: string;
    // Step 3
    skills: string;
    passions: string;
    payment: number;
    // Step 4
    about: string;
}