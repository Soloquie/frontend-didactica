import { TestBed } from '@angular/core/testing';

import { AprendizajeApi } from './aprendizaje-api';

describe('AprendizajeApi', () => {
  let service: AprendizajeApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AprendizajeApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
