import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityPageComponent } from './community-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommunityService } from '../../shared/community/community.service';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';

describe('CommunityPageComponent', () => {
    let component: CommunityPageComponent;
    let fixture: ComponentFixture<CommunityPageComponent>;
    let element: HTMLElement;
    const mockComService = {
        init: (id) => {
            const componentName = (id === 'test') ? 'Test Name' : 'Invalid router snap id';
            return new BehaviorSubject<string>(componentName);
        },
        get searchMembers() {
            return of(['']);
        },
        get searchSkills() {
            return of(['']);
        }
    };
    const mockRouter = jasmine.createSpyObj('Router', ['members']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CommunityPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: CommunityService, useValue: mockComService },
                { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'test' } } } }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunityPageComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('Test router snapshot params', () => {
        it('should set proper snap id', () => {
            expect(component.communityName).toEqual('Test Name');
        });
        it('should bind community name', () => {
            // component.communityName = 'Test Name';
            fixture.detectChanges();
            expect(element.querySelector('h2').textContent).toEqual('Test Name');
        });
    });
});
