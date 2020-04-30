import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransactionHistoryComponent } from './account-transaction-history.component';

describe('AccountTransactionHistoryComponent', () => {
  let component: AccountTransactionHistoryComponent;
  let fixture: ComponentFixture<AccountTransactionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountTransactionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
