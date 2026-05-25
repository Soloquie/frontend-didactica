import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprendizajeEditor } from './aprendizaje-editor';

describe('AprendizajeEditor', () => {
  let component: AprendizajeEditor;
  let fixture: ComponentFixture<AprendizajeEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprendizajeEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprendizajeEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
