import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteRegistroComponent } from './paciente-registro.component';

describe('PacienteRegistroComponent', () => {
  let component: PacienteRegistroComponent;
  let fixture: ComponentFixture<PacienteRegistroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacienteRegistroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacienteRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
