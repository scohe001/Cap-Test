import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranTypePieChartComponent } from './tran-type-pie-chart.component';

describe('TranTypePieChartComponent', () => {
  let component: TranTypePieChartComponent;
  let fixture: ComponentFixture<TranTypePieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranTypePieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranTypePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
