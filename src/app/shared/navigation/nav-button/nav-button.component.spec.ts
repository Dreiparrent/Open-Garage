import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavButtonComponent } from './nav-button.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('NavButtonComponent', () => {
    let component: NavButtonComponent;
    let fixture: ComponentFixture<NavButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NavButtonComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
