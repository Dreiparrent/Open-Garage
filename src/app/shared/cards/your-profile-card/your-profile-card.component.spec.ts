import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourProfileCardComponent } from './your-profile-card.component';

describe('YourProfileCardComponent', () => {
  let component: YourProfileCardComponent;
  let fixture: ComponentFixture<YourProfileCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourProfileCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
