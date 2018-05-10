import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitiesMapComponent } from './communities-map.component';

describe('CommunitiesMapComponent', () => {
  let component: CommunitiesMapComponent;
  let fixture: ComponentFixture<CommunitiesMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitiesMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitiesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
