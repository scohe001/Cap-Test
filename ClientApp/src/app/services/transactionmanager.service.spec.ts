import { TestBed } from '@angular/core/testing';

import { TransactionmanagerService } from './transactionmanager.service';

describe('TransactionmanagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionmanagerService = TestBed.get(TransactionmanagerService);
    expect(service).toBeTruthy();
  });
});
