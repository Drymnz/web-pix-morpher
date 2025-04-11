import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaPriacidadComponent } from './politica-priacidad.component';

describe('PoliticaPriacidadComponent', () => {
  let component: PoliticaPriacidadComponent;
  let fixture: ComponentFixture<PoliticaPriacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaPriacidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticaPriacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
