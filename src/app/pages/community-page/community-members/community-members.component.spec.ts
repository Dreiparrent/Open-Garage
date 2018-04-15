import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityMembersComponent } from './community-members.component';
import { IProfile } from '../../../shared/community/community-interfaces';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavigationService } from '../../../shared/navigation/navigation-service';
import { CommunityService } from '../../../shared/community/community.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

describe('CommunityMembersComponent', () => {
    let component: CommunityMembersComponent;
    let fixture: ComponentFixture<CommunityMembersComponent>;

    beforeEach(async(() => {
        const mockNavService = {};
        const mockComService = {
            get members() {
                return new BehaviorSubject<IProfile[]>([]);
            },
            set members(mems) {
            }
        };
        const mockMedia = jasmine.createSpyObj('Media', ['matchMedia']);
        mockMedia.matchMedia.and.returnValue(<MediaQueryList>{
            addListener: (litener) => { },
            removeListener: (listener) => {}
        });
        TestBed.configureTestingModule({
            declarations: [CommunityMembersComponent],
            providers: [
                { provide: CommunityService, useValue: mockComService},
                { provide: NavigationService, useValue: mockNavService},
                { provide: MediaMatcher, useValue: mockMedia}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunityMembersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
