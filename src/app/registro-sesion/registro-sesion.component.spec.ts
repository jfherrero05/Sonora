import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroSesionComponent } from './registro-sesion.component';

describe('RegistroSesionComponent', () => {
  let component: RegistroSesionComponent;
  let fixture: ComponentFixture<RegistroSesionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroSesionComponent]
    });
    fixture = TestBed.createComponent(RegistroSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
