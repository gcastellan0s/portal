import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteTratamientoComponent } from './paciente-tratamiento.component';

describe('PacienteTratamientoComponent', () => {
  let component: PacienteTratamientoComponent;
  let fixture: ComponentFixture<PacienteTratamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacienteTratamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacienteTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
