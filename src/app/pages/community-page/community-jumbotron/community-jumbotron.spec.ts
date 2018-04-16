import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityJumbotronComponent } from './community-jumbotron.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CommunityJumbotronComponent', () => {
    let component: CommunityJumbotronComponent;
    let fixture: ComponentFixture<CommunityJumbotronComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CommunityJumbotronComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
