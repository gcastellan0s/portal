import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMedicinaComponent } from './detalle-medicina.component';

describe('DetalleMedicinaComponent', () => {
  let component: DetalleMedicinaComponent;
  let fixture: ComponentFixture<DetalleMedicinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleMedicinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleMedicinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
