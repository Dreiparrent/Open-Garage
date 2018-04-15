import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySkillsComponent } from './community-skills.component';
import { CommunityService } from '../../../shared/community/community.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IProfile } from '../../../shared/community/community-interfaces';
import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({ selector: 'app-skills-card', template: ''})
class StubSkillCardComponent {
    @Input('skill') skill;
    @Input('profiles') profiles;
}

describe('CommunitySkillsComponent', () => {
    let component: CommunitySkillsComponent;
    let fixture: ComponentFixture<CommunitySkillsComponent>;

    beforeEach(async(() => {
        const mockComService = {
            get members() {
                return new BehaviorSubject<IProfile[]>([]);
            }
        };
        TestBed.configureTestingModule({
            declarations: [CommunitySkillsComponent, StubSkillCardComponent],
            providers: [
                {provide: CommunityService, useValue: mockComService}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunitySkillsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
