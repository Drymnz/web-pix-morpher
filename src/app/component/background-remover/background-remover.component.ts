import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavComponent } from "../nav/nav.component";
import { FooterComponent } from "../footer/footer.component";
import { ImagenLoadComponent } from "../imagen-load/imagen-load.component";
import { BackgroundRemovalService } from '../../services/background-removal/background-removal.service';
import { ImageProcessorService } from '../../services/download-imge/image-processor.service';

@Component({
  selector: 'app-background-remover',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavComponent,
    FooterComponent,
    ImagenLoadComponent
  ],
  templateUrl: './background-remover.component.html',
  styleUrl: './background-remover.component.css',
  providers: [BackgroundRemovalService]
})


export class BackgroundRemoverComponent implements OnDestroy {
  error: string = '';
  selectedFile: File | null = null;
  processedImageUrl: string | null = null;
  isProcessing: boolean = false;
  progress: number = 0;
  progressMessage: string = '';

  isReadyToProcess: boolean = false; // Nueva variable para controlar cuándo se puede procesar

  tolerance: number = 50; // Valor de tolerancia inicial
  isSettingsAdjusted: boolean = false; // Nueva variable para indicar que los ajustes han sido modificados
Math: Math = Math; // Para usar Math en la plantilla

  onToleranceChange(value: number): void {
    this.tolerance = value;
    this.isSettingsAdjusted = true; // Se marca que los ajustes han cambiado
    this.checkIfReady();
  }

  onThresholdChange(value: number): void {
    this.threshold = value;
    this.isSettingsAdjusted = true;
    this.checkIfReady();
    this.selectedPreset = this.presets.length - 1; // Siempre va a "Personalizado"
  }

  checkIfReady(): void {
    this.isReadyToProcess = this.selectedFile !== null && this.isSettingsAdjusted;
  }

  // En tu componente TypeScript
applyPreset(index: number): void {
  this.selectedPreset = index;
  this.threshold = this.presets[index].threshold;
  this.isSettingsAdjusted = true;
  this.checkIfReady();
}
isMatchingThreshold(presetThreshold: number): boolean {
  return Math.abs(presetThreshold - this.threshold) < 0.05;
}




  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.error = '';
    this.progress = 0;
    this.progressMessage = '';
    this.isReadyToProcess = false; // Se desactiva hasta que la imagen se valide correctamente

    if (file) {
      this.setupPreviewCanvas();
      this.isReadyToProcess = true; // Se activa cuando la imagen está lista
    }
  }

  handleCanvasClick(event: MouseEvent): void {
    if (!this.isPickingColor || !this.previewCanvas || !this.previewCtx) return;

    const rect = this.previewCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pixel = this.previewCtx.getImageData(x, y, 1, 1).data;
    const hex = '#' +
      ('0' + pixel[0].toString(16)).slice(-2) +
      ('0' + pixel[1].toString(16)).slice(-2) +
      ('0' + pixel[2].toString(16)).slice(-2);

    this.keyColor = hex;
    this.isPickingColor = false;
    this.isReadyToProcess = true; // Ahora sí está listo para procesar
  }


  removalModes = [
    { id: 'ai', name: 'IA (Automático)' },
    { id: 'color', name: 'Color Key (Manual)' }
  ];
  selectedMode: string = 'ai';

  threshold: number = 0.5;
  showAdvancedSettings: boolean = false;

  keyColor: string = '#00FF00';
  colorTolerance: number = 30;

  presets = [
    { name: 'Logos y gráficos', threshold: 0.3 },
    { name: 'Personas', threshold: 0.5 },
    { name: 'Productos', threshold: 0.4 },
    { name: 'Personalizado', threshold: this.threshold }
  ];

  selectedPreset: number = 1;
  isPickingColor: boolean = false;
  previewCanvas: HTMLCanvasElement | null = null;
  previewCtx: CanvasRenderingContext2D | null = null;
  private canvasClickListener?: (event: MouseEvent) => void;

  constructor(
    private backgroundService: BackgroundRemovalService,
    private imageProcessorService: ImageProcessorService
  ) { }

  ngOnDestroy(): void {
    this.cleanupCanvasEvents();
  }



  setupPreviewCanvas(): void {
    if (!this.selectedFile) return;

    this.cleanupCanvasEvents();

    if (!this.previewCanvas) {
      this.previewCanvas = document.createElement('canvas');
      this.previewCtx = this.previewCanvas.getContext('2d');
    }

    const img = new Image();
    img.onload = () => {
      if (this.previewCanvas && this.previewCtx) {
        this.previewCanvas.width = img.width;
        this.previewCanvas.height = img.height;

        this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
        this.previewCtx.drawImage(img, 0, 0);

        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) {
          previewContainer.innerHTML = '';
          previewContainer.appendChild(this.previewCanvas);

          this.canvasClickListener = this.handleCanvasClick.bind(this);
          this.previewCanvas.addEventListener('click', this.canvasClickListener);
        }
      }
    };

    img.onerror = () => {
      this.error = 'Error al cargar la imagen de vista previa';
    };

    img.src = URL.createObjectURL(this.selectedFile);
  }

  private cleanupCanvasEvents(): void {
    if (this.previewCanvas && this.canvasClickListener) {
      this.previewCanvas.removeEventListener('click', this.canvasClickListener);
    }
  }

  toggleColorPicker(): void {
    this.isPickingColor = !this.isPickingColor;
  }



  changeMode(mode: string): void {
    this.selectedMode = mode;
  }

  async processImage(): Promise<void> {
    if (!this.selectedFile) {
      this.error = 'Selecciona una imagen primero.';
      return;
    }

    this.isProcessing = true;
    this.progress = 10;
    this.progressMessage = 'Iniciando procesamiento...';

    try {
      const img = await this.loadImage(this.selectedFile);

      this.progress = 30;
      this.progressMessage = this.selectedMode === 'ai'
        ? 'Cargando modelo de segmentación...'
        : 'Preparando procesamiento de color...';

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      this.progress = 50;
      this.progressMessage = 'Removiendo fondo de la imagen...';

      const options = this.selectedMode === 'ai'
        ? { threshold: this.threshold }
        : {
          useColorKey: true,
          keyColor: this.keyColor,
          colorTolerance: this.colorTolerance
        };

      const processedImageUrl = await this.backgroundService.removeBackground(img, canvas, options);
      this.processedImageUrl = processedImageUrl;

      this.progress = 70;
      this.progressMessage = 'Preparando imagen para descarga...';

      await this.downloadProcessedImage(processedImageUrl, this.selectedFile.name);

      this.progress = 100;
      this.progressMessage = '¡Procesamiento completado!';

      setTimeout(() => {
        if (this.progress === 100) {
          this.resetProcessingState();
        }
      }, 3000);
    } catch (err) {
      console.error('Error al procesar la imagen:', err);
      this.error = 'Error al procesar la imagen.';
      this.resetProcessingState();
    }
  }

  private async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private async downloadProcessedImage(imageUrl: string, originalFileName: string): Promise<void> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileNameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
    const fileExt = originalFileName.substring(originalFileName.lastIndexOf('.') + 1);
    const newFileName = `${fileNameWithoutExt}_sin_fondo.${fileExt}`;

    this.downloadBlob(blob, newFileName);
    URL.revokeObjectURL(imageUrl);
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const blobUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  }

  private resetProcessingState(): void {
    this.isProcessing = false;
    this.progress = 0;
    this.progressMessage = '';
  }

  toggleAdvancedSettings(): void {
    this.showAdvancedSettings = !this.showAdvancedSettings;
    if (this.showAdvancedSettings) {
      this.selectedPreset = this.presets.length - 1;
    }
  }
}