import { TestBed } from '@angular/core/testing';

import { PublicActividadApi } from './public-actividad-api';

describe('PublicActividadApi', () => {
  let service: PublicActividadApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicActividadApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
