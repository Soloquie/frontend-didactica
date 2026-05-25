import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleActividad } from './detalle-actividad';

describe('DetalleActividad', () => {
  let component: DetalleActividad;
  let fixture: ComponentFixture<DetalleActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleActividad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleActividad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
