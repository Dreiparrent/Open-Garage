import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { StubSideNav, StubNavButton, ROComponent, StubSN, StubSNContent, StubSNContainer } from '../../../testing/layout.stub';


describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RegisterComponent,
                StubSideNav,
                StubNavButton,
                ROComponent,
                StubSN,
                StubSNContent,
                StubSNContainer
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});