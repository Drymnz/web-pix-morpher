import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenLoadComponent } from './imagen-load.component';

describe('ImagenLoadComponent', () => {
  let component: ImagenLoadComponent;
  let fixture: ComponentFixture<ImagenLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagenLoadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagenLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
