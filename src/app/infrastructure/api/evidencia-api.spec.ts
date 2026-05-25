import { TestBed } from '@angular/core/testing';

import { EvidenciaApi } from './evidencia-api';

describe('EvidenciaApi', () => {
  let service: EvidenciaApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvidenciaApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
