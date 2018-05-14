import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourProfileDialogComponent } from './your-profile-dialog.component';

describe('YourProfileDialogComponent', () => {
  let component: YourProfileDialogComponent;
  let fixture: ComponentFixture<YourProfileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourProfileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
