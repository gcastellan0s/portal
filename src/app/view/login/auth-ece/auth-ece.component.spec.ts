import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthEceComponent } from './auth-ece.component';

describe('AuthEceComponent', () => {
  let component: AuthEceComponent;
  let fixture: ComponentFixture<AuthEceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthEceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthEceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
