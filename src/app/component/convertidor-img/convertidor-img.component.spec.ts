import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertidorImgComponent } from './convertidor-img.component';

describe('ConvertidorImgComponent', () => {
  let component: ConvertidorImgComponent;
  let fixture: ComponentFixture<ConvertidorImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertidorImgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertidorImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
