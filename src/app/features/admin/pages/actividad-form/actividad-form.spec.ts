import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadForm } from './actividad-form';

describe('ActividadForm', () => {
  let component: ActividadForm;
  let fixture: ComponentFixture<ActividadForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
