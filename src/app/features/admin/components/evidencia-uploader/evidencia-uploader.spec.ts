import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciaUploader } from './evidencia-uploader';

describe('EvidenciaUploader', () => {
  let component: EvidenciaUploader;
  let fixture: ComponentFixture<EvidenciaUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvidenciaUploader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciaUploader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
