import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAveragesComponent } from './daily-averages.component';

describe('DailyAveragesComponent', () => {
  let component: DailyAveragesComponent;
  let fixture: ComponentFixture<DailyAveragesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyAveragesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
