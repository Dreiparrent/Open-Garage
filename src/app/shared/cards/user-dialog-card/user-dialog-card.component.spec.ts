import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDialogCardComponent } from './user-dialog-card.component';

describe('UserDialogCardComponent', () => {
  let component: UserDialogCardComponent;
  let fixture: ComponentFixture<UserDialogCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDialogCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDialogCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
