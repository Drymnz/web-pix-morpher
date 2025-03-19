// dimension-selector.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dimension-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dimension-selector.component.html',
  styleUrl: './dimension-selector.component.css'
})
export class DimensionSelectorComponent {
  width: number = 800;
  height: number = 600;
  @Output() dimensionsChanged = new EventEmitter<{ width: number; height: number }>();

  emitChanges(): void {
    this.dimensionsChanged.emit({ width: this.width, height: this.height });
  }
}
