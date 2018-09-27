import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMessagesDialogComponent } from './mobile-messages-dialog.component';

describe('MobileMessagesDialogComponent', () => {
  let component: MobileMessagesDialogComponent;
  let fixture: ComponentFixture<MobileMessagesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileMessagesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMessagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
