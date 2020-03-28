import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranHistoryLineGraphComponent } from './tran-history-line-graph.component';

describe('TranHistoryLineGraphComponent', () => {
  let component: TranHistoryLineGraphComponent;
  let fixture: ComponentFixture<TranHistoryLineGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranHistoryLineGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranHistoryLineGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
