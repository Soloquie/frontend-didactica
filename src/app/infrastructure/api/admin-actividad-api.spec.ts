import { TestBed } from '@angular/core/testing';

import { AdminActividadApi } from './admin-actividad-api';

describe('AdminActividadApi', () => {
  let service: AdminActividadApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminActividadApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
