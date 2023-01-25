import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupWeeklyComponent } from './popup-weekly.component';

describe('PopupWeeklyComponent', () => {
  let component: PopupWeeklyComponent;
  let fixture: ComponentFixture<PopupWeeklyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupWeeklyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
