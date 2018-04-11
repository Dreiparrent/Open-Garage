import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsSliderComponent } from './skills-slider.component';

describe('SkillsSliderComponent', () => {
  let component: SkillsSliderComponent;
  let fixture: ComponentFixture<SkillsSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
