import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEditor } from './material-editor';

describe('MaterialEditor', () => {
  let component: MaterialEditor;
  let fixture: ComponentFixture<MaterialEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
