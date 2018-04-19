import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityMessagesComponent } from './community-messages.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';

describe('CommunityMessagesComponent', () => {
    let component: CommunityMessagesComponent;
    let fixture: ComponentFixture<CommunityMessagesComponent>;
    const mockComService = {
        updateSearch: (members: string[], skills: string[]) => { }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CommunityMessagesComponent],
            providers: [{ provide: CommunityService, useValue: mockComService }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunityMessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
