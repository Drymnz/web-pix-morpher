import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-imagen-load',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './imagen-load.component.html',
  styleUrl: './imagen-load.component.css'
})
export class ImagenLoadComponent {
  @Output() fileSelected = new EventEmitter<File>();
  imagePreview: string | null = null;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileSelected.emit(file);
      this.previewImage(file);
    }
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}