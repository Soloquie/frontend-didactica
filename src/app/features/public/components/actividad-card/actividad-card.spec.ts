import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadCard } from './actividad-card';

describe('ActividadCard', () => {
  let component: ActividadCard;
  let fixture: ComponentFixture<ActividadCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
