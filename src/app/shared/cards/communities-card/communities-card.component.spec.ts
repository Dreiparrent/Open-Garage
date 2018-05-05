import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommmunityCardComponent } from './commmunity-card.component';

describe('CommmunityCardComponent', () => {
  let component: CommmunityCardComponent;
  let fixture: ComponentFixture<CommmunityCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommmunityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommmunityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
