import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailsInputComponent } from './transaction-details-input.component';

describe('TransactionDetailsInputComponent', () => {
  let component: TransactionDetailsInputComponent;
  let fixture: ComponentFixture<TransactionDetailsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionDetailsInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
