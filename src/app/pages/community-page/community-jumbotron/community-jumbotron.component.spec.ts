import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityJumbotronComponent } from './community-jumbotron.component';

describe('JumbotronComponent', () => {
    let component: CommunityJumbotronComponent;
    let fixture: ComponentFixture<CommunityJumbotronComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CommunityJumbotronComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunityJumbotronComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
