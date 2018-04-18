import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityComponent } from './community.component';
import { StubSideNav, StubNavButton, StubComNav, ROComponent, StubSN, StubSNContent, StubSNContainer } from '../../../testing/layout.stub';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('CommunityComponent', () => {
    let component: CommunityComponent;
    let fixture: ComponentFixture<CommunityComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CommunityComponent,
                StubSideNav,
                StubNavButton,
                StubComNav,
                ROComponent,
                StubSN,
                StubSNContent,
                StubSNContainer
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});