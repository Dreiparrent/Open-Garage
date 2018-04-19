import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsCardComponent } from './skills-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IProfile } from '../../community/community-interfaces';
import { CommunityService } from '../../community/community.service';

describe('SkillsCardComponent', () => {
    let component: SkillsCardComponent;
    let fixture: ComponentFixture<SkillsCardComponent>;
    let element: HTMLElement;
    const mockComService = {};

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SkillsCardComponent],
            providers: [{ provide: CommunityService, useValue: mockComService }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SkillsCardComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Card Bindings', () => {
        it('should bind correct skill', () => {
            component.skill = 'Test Skill';
            fixture.detectChanges();
            expect(element.querySelector('h4').textContent).toContain('Test Skill');
        });
        it('should bind correct profile names', () => {
            component.profiles = [
                <IProfile>{
                    name: 'Name 1'
                },
                <IProfile>{
                    name: 'Name 2'
                },
                <IProfile>{
                    name: 'Name 3'
                }
            ];
            fixture.detectChanges();
            expect(element.querySelectorAll('mat-list-item')[0].textContent).toContain('Name 1');
            expect(element.querySelectorAll('mat-list-item')[1].textContent).toContain('Name 2');
            expect(element.querySelectorAll('mat-list-item')[2].textContent).toContain('Name 3');
        });
    });
});
