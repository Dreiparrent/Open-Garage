import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Search404Component } from './search-404.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('Search404Component', () => {
    let component: Search404Component;
    let fixture: ComponentFixture<Search404Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Search404Component],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Search404Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
