import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySkillsComponent } from './community-skills.component';

describe('CommunitySkillsComponent', () => {
  let component: CommunitySkillsComponent;
  let fixture: ComponentFixture<CommunitySkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitySkillsComponent ]
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
