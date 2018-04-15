import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { StubSideNav, StubNavButton, ROComponent, StubSN, StubSNContent, StubSNContainer } from '../../../testing/layout.stub';


describe('SearchComponent', () => {
    let component: SearchComponent;
    let fixture: ComponentFixture<SearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SearchComponent,
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
        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
