import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionPortafolio } from './configuracion-portafolio';

describe('ConfiguracionPortafolio', () => {
  let component: ConfiguracionPortafolio;
  let fixture: ComponentFixture<ConfiguracionPortafolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionPortafolio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionPortafolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
