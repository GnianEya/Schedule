import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySearchProfileComponent } from './weekly-search-profile.component';

describe('WeeklySearchProfileComponent', () => {
  let component: WeeklySearchProfileComponent;
  let fixture: ComponentFixture<WeeklySearchProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeeklySearchProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklySearchProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
