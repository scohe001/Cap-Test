import { TestBed } from '@angular/core/testing';

import { AccountmanagerService } from './accountmanager.service';

describe('AccountmanagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountmanagerService = TestBed.get(AccountmanagerService);
    expect(service).toBeTruthy();
  });
});
