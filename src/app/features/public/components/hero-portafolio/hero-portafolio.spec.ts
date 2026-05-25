import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroPortafolio } from './hero-portafolio';

describe('HeroPortafolio', () => {
  let component: HeroPortafolio;
  let fixture: ComponentFixture<HeroPortafolio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroPortafolio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroPortafolio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
