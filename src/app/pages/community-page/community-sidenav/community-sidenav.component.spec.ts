import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySidenavComponent } from './community-sidenav.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IProfile } from '../../../shared/community/community-interfaces';
import { of } from 'rxjs/observable/of';

describe('CommunitySidenavComponent', () => {
    let component: CommunitySidenavComponent;
    let fixture: ComponentFixture<CommunitySidenavComponent>;

    beforeEach(async(() => {
        const mockComService = {
            get members() {
                return new BehaviorSubject<IProfile[]>([]);
            },
            isSmall: () => of(false)
        };
        TestBed.configureTestingModule({
            declarations: [CommunitySidenavComponent],
            providers: [
                { provide: CommunityService, useValue: mockComService }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunitySidenavComponent);
        component = fixture.componentInstance;
        const mockSide = jasmine.createSpyObj('sidenav', ['toggle']);
        mockSide.toggle.and.returnValue(new Promise(() => { }));
        component.comnav = mockSide;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
