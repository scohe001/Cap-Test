import { TestBed } from '@angular/core/testing';

import { ApplicationUserManagerService } from './application-user-manager.service';

describe('ApplicationUserManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationUserManagerService = TestBed.get(ApplicationUserManagerService);
    expect(service).toBeTruthy();
  });
});
