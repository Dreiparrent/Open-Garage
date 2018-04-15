import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPageComponent } from './search-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SearchPageComponent', () => {
    let component: SearchPageComponent;
    let fixture: ComponentFixture<SearchPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
