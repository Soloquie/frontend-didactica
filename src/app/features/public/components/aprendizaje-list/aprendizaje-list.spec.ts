import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprendizajeList } from './aprendizaje-list';

describe('AprendizajeList', () => {
  let component: AprendizajeList;
  let fixture: ComponentFixture<AprendizajeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprendizajeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprendizajeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
