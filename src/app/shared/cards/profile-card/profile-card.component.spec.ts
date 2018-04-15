import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCardComponent } from './profile-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ProfileCardComponent', () => {
    let component: ProfileCardComponent;
    let fixture: ComponentFixture<ProfileCardComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProfileCardComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileCardComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Card Bindings', () => {
        it('should bind correct name', () => {
            component.name = 'Test Name';
            fixture.detectChanges();
            expect(element.querySelector('h3').textContent).toContain('Test Name');
        });
        it('should bind correct imgUrl', () => {
            component.imgUrl = 'testUrl';
            fixture.detectChanges();
            expect(element.querySelector('img').src).toContain('testUrl');
        });
        it('should bind correct location', () => {
            component.location = 'location';
            fixture.detectChanges();
            expect(element.querySelectorAll('span')[0].textContent).toContain('location');
        });
        it('should bind correct connections', () => {
            component.connections = 14;
            fixture.detectChanges();
            expect(element.querySelectorAll('span')[1].textContent).toContain('14');
        });
    });
});
