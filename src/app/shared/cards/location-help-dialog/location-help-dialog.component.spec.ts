import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationHelpDialogComponent } from './location-help-dialog.component';

describe('LocationHelpDialogComponent', () => {
  let component: LocationHelpDialogComponent;
  let fixture: ComponentFixture<LocationHelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationHelpDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
