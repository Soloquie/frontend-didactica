import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadFormulario } from './actividad-formulario';

describe('ActividadFormulario', () => {
  let component: ActividadFormulario;
  let fixture: ComponentFixture<ActividadFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadFormulario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadFormulario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
