import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityJumbotronComponent } from './community-jumbotron.component';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, Directive, Input, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { IProfile } from '../../../shared/community/community-interfaces';
import { CommunityService } from '../../../shared/community/community.service';

// tslint:disable-next-line:directive-selector
@Directive({ selector: 'mat-autocomplete', exportAs: 'matAutocomplete'})
export class StubAutoDirective {
    @Input('matAutocomplete') matAutocomplete;
}
// tslint:disable-next-line:directive-selector
@Directive({ selector: '[input[matAutocomplete]]', exportAs: 'matAutocompleteTrigger' })
export class StubAutoTriggerDirective {
    @Input('matAutocomplete') matAutocomplete;
}
// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-form-field', template: '' })
export class StubFieldComponent {
}
// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-option', template: '' })
export class StubOptionComponent {
    @Input('value') value;
}
// tslint:disable-next-line:component-selector
@Component({ selector: 'mat-icon', template: '' })
export class StubIconComponent {
}
describe('CommunityJumbotronComponent', () => {
    let component: CommunityJumbotronComponent;
    let fixture: ComponentFixture<CommunityJumbotronComponent>;
    const mockComService = {
        get members() {
            return new BehaviorSubject<IProfile[]>([]);
        },
        updateSerach: (members: string[], skills: string[]) => { }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CommunityJumbotronComponent,
                StubOptionComponent,
                StubFieldComponent,
                StubIconComponent,
                StubAutoDirective,
                StubAutoTriggerDirective
            ],
            imports: [ReactiveFormsModule, FormsModule ],
            providers: [
                {provide: CommunityService, useValue: mockComService}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunityJumbotronComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
