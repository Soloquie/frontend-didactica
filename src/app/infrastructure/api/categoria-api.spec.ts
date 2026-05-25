import { TestBed } from '@angular/core/testing';

import { CategoriaApi } from './categoria-api';

describe('CategoriaApi', () => {
  let service: CategoriaApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
