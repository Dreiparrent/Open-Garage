import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitiesSearchComponent } from './communities-search.component';

describe('CommunitiesSearchComponent', () => {
  let component: CommunitiesSearchComponent;
  let fixture: ComponentFixture<CommunitiesSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitiesSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitiesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
