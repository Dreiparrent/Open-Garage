import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { RouterLinkDirectiveStub } from '../../../testing/router-link-directive-stub';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import { NavigationService } from './navigation-service';
import { AuthService } from '../auth/auth.service';
import { CommunityService } from '../community/community.service';
import { CommunityServiceStub } from '../../../testing/community-service.stub';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material';

// tslint:disable-next-line:component-selector
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('NavigationComponent', () => {
    let component: NavigationComponent;
    let fixture: ComponentFixture<NavigationComponent>;

    beforeEach(async(() => {
        const mockNavService = {
            comSenderListen: () => of(false),
            listen: () => of(false)
        };
        const mockComService = {
            getCommunities: () => []
        };
        const mockAuthService = {
            isAuthenticated: () => true
        };
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                NavigationComponent,
                RouterOutletStubComponent
            ],
            providers: [
                { provide: NavigationService, useValue: mockNavService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: CommunityService, useValue: mockComService }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
        const mockSide = <MatSidenav>{
            get openedChange() {
                return new EventEmitter<boolean>(false);
            },
            toggle: () => new Promise<MatDrawerToggleResult>(() => { })
        };
        component.sidenav = mockSide;
        component.extnav = mockSide;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
