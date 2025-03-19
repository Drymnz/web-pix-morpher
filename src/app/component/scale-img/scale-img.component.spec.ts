import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleImgComponent } from './scale-img.component';

describe('ScaleImgComponent', () => {
  let component: ScaleImgComponent;
  let fixture: ComponentFixture<ScaleImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaleImgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScaleImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
