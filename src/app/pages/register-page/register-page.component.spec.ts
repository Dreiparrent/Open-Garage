import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPageComponent } from './register-page.component';
import { FormBuilder, ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of } from 'rxjs/observable/of';
import { CUSTOM_ELEMENTS_SCHEMA, forwardRef } from '@angular/core';
import { RegisterService, IRegister } from './register.service';
import { MatInputModule, MatChipsModule, MatSelectModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterLinkDirectiveStub } from '../../../testing/router-link-directive-stub';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MatInStub {

}

describe('RegisterPageComponent', () => {
    // default vars
    let component: RegisterPageComponent;
    let fixture: ComponentFixture<RegisterPageComponent>;


    const mockRegisterService = jasmine.createSpyObj('RegisterService', ['registerUser']);
    beforeEach(async(() => {

        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatInputModule, MatChipsModule, MatSelectModule, NoopAnimationsModule, NgbModule.forRoot()],
            declarations: [RegisterPageComponent],
            providers: [
                { provide: RegisterService, useValue: mockRegisterService }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('testRegister', () => {
        it('should send correct user data', () => {
            component.inputSkills = ['skill1', 'skill2'];
            component.inputPassions = ['passion'];
            const formValues = {
                email: 'email',
                pass1: 'pass1',
                pass2: 'pass1',
                fName: 'fName',
                lName: 'lName',
                location: 'location',
                skills: 'skill2',
                pasions: 'passion',
                payment: ['Nothing, happy to help'],
                about: 'about'
            };
            const expectValues = {
                email: 'email',
                pass: 'pass1',
                fName: 'fName',
                lName: 'lName',
                location: 'location',
                skills: ['skill1', 'skill2'],
                passions: ['passion'],
                payment: [0],
                about: 'about'
            };
            component.submitRegister(formValues);
            expect(mockRegisterService.registerUser).toHaveBeenCalledWith(expectValues);
            // expect(mockRegisterService)
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
