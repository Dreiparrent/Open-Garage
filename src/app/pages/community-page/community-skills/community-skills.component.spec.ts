import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySkillsComponent } from './community-skills.component';
import { CommunityService } from '../../../shared/community/community.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { IProfile } from '../../../shared/community/community-interfaces';
import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
    selector: 'app-skills-card', template: `
    <h4>{{skill}}</h4><ul><li *ngFor="let profile of profiles">{{profile.name}}</li></ul>
`})
class StubSkillCardComponent {
    @Input('skill') skill;
    @Input('profiles') profiles;
}

describe('CommunitySkillsComponent', () => {
    let component: CommunitySkillsComponent;
    let fixture: ComponentFixture<CommunitySkillsComponent>;
    let element: HTMLElement;
    const testMembers: IProfile[] = [
        <IProfile>{ name: 'test 1', skills: ['s1', 's2', 's3'] },
        <IProfile>{ name: 'test 2', skills: ['s1', 's2', 's3'] },
        <IProfile>{ name: 'test 3', skills: ['s1', 's2', 's3', 'special'] },
    ];
    let mockComService;
    let _searchSkills;

    beforeEach(async(() => {
        _searchSkills = new Subject<string[]>();
        mockComService = {
            get members() {
                return new BehaviorSubject<IProfile[]>(testMembers);
            },
            get searchSkills() {
                return _searchSkills;
            },
            set searchSkills(sk) {
                _searchSkills.next(sk);
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
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Card Bindings', () => {
        it('should have 4 cards', () => {
            expect(element.getElementsByTagName('app-skills-card').length).toEqual(4);
        });
        it('should bind correct card skills', () => {
            expect(element.getElementsByTagName('app-skills-card')[0].children[0].textContent).toEqual('s1');
        });
        it('should bind correct card profiles', () => {
            expect(element.getElementsByTagName('app-skills-card')[0].children[1].childElementCount).toEqual(3);
            expect(element.getElementsByTagName('app-skills-card')[0].children[1].children[0].textContent).toEqual('test 1');
            expect(element.getElementsByTagName('app-skills-card')[0].children[1].children[1].textContent).toEqual('test 2');
            expect(element.getElementsByTagName('app-skills-card')[0].children[1].children[2].textContent).toEqual('test 3');
        });
        it('should have 1 search member', () => {
            mockComService.searchSkills = ['special'];
            fixture.detectChanges();
            expect(element.getElementsByTagName('app-skills-card').length).toEqual(1);
        });
        it('should bind search member', () => {
            // TODO:
            expect(true).toEqual(false);
        });
    });
});
