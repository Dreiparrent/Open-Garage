import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsSliderComponent } from './skills-slider.component';
import { MediaMatcher } from '@angular/cdk/layout';

describe('SkillsSliderComponent', () => {
    let component: SkillsSliderComponent;
    let fixture: ComponentFixture<SkillsSliderComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        const mockMedia = jasmine.createSpyObj('Media', ['matchMedia']);
        mockMedia.matchMedia.and.returnValue(<MediaQueryList>{
            addListener: (litener) => { },
            removeListener: (listener) => { }
        });
        TestBed.configureTestingModule({
            declarations: [SkillsSliderComponent],
            providers: [{ provide: MediaMatcher, useValue: mockMedia }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SkillsSliderComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    const testSkills = {
        s0: 3,
        s1: 5,
        s2: 5,
        s3: 4,
        s4: 4,
        s5: 2,
        s6: 2,
        s7: 1,
        s8: 1,
        s9: 3
    };

    describe('skills input', () => {
        beforeEach(() => {
            component.sortSkills(testSkills);
            fixture.detectChanges();
        });
        it('should store correct skills', () => {
            expect(component.topSkills).toEqual(['s1', 's2', 's3', 's4', 's0', 's9']);
        });
        it('should bind correct skills', () => {
            expect(element.querySelectorAll('p')[0].textContent).toEqual('s1');
        });
        it('should calculate proper size', () => {
            expect(component.getStyle('s0')).toEqual('12.5%');
        });
        it('should display 6 skills', () => {
            expect(element.getElementsByClassName('skillsClass').length).toEqual(6);
        });
    });

    describe('small screen', () => {
        beforeEach(() => {
            component.skillsNumber = 3;
            component.sortSkills(testSkills);
            fixture.detectChanges();
        });
        it('should calculate proper size', () => {
            expect(component.getStyle('s1').substr(0, 2)).toEqual('35');
        });
        it('should display 3 skills', () => {
            expect(element.getElementsByClassName('skillsClass').length).toEqual(3);
        });
    });
});
