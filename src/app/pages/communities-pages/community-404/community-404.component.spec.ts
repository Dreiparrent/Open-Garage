import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Community404Component } from './community-404.component';

describe('Community404Component', () => {
  let component: Community404Component;
  let fixture: ComponentFixture<Community404Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Community404Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Community404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
