import { TestBed } from '@angular/core/testing';

import { RefreshApiService } from './refresh-api.service';

describe('RefreshApiService', () => {
  let service: RefreshApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
