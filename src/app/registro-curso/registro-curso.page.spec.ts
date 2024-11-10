import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroCursoPage } from './registro-curso.page';

describe('RegistroCursoPage', () => {
  let component: RegistroCursoPage;
  let fixture: ComponentFixture<RegistroCursoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCursoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
