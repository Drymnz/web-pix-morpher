import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenLoadComponent } from '../imagen-load/imagen-load.component';
import { DimensionSelectorComponent } from '../dimension-selector/dimension-selector.component';
import { ImageProcessorService } from '../../services/image-processor.service';
import { FooterComponent } from "../footer/footer.component";
import { NavComponent } from "../nav/nav.component";

@Component({
  selector: 'app-scale-img',
  standalone: true,
  imports: [CommonModule, ImagenLoadComponent, DimensionSelectorComponent, FooterComponent, NavComponent],
  templateUrl: './scale-img.component.html',
  styleUrl: './scale-img.component.css'
})
export class ScaleImgComponent {
  selectedFile: File | null = null;
  targetWidth: number = 800;
  targetHeight: number = 600;
  error: string = '';

  constructor(private imageProcessor: ImageProcessorService) {}

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.error = '';
  }

  onDimensionsChanged(dimensions: { width: number; height: number }): void {
    this.targetWidth = dimensions.width;
    this.targetHeight = dimensions.height;
  }

  async processImage(): Promise<void> {
    if (!this.selectedFile) {
      this.error = 'Por favor seleccione una imagen';
      return;
    }

    try {
      await this.imageProcessor.processImage(
        this.selectedFile,
        this.targetWidth,
        this.targetHeight
      );
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Error procesando la imagen';
    }
  }
}