import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCommunityDialogComponent } from './create-community-dialog.component';

describe('CreateCommunityDialogComponent', () => {
  let component: CreateCommunityDialogComponent;
  let fixture: ComponentFixture<CreateCommunityDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCommunityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommunityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
