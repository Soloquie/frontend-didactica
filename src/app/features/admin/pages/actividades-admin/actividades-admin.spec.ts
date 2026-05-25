import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesAdmin } from './actividades-admin';

describe('ActividadesAdmin', () => {
  let component: ActividadesAdmin;
  let fixture: ComponentFixture<ActividadesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
