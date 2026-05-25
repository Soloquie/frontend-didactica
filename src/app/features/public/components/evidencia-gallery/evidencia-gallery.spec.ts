import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciaGallery } from './evidencia-gallery';

describe('EvidenciaGallery', () => {
  let component: EvidenciaGallery;
  let fixture: ComponentFixture<EvidenciaGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvidenciaGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciaGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
