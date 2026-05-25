import { TestBed } from '@angular/core/testing';

import { MaterialApi } from './material-api';

describe('MaterialApi', () => {
  let service: MaterialApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
