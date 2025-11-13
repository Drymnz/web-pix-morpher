/**
 * Descarga un archivo a partir de una URL
 */
export function descargarArchivo(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  }
  
  /**
   * Genera un nombre de archivo para la imagen convertida
   */
  export function generarNombreArchivo(nombreOriginal: string, formato: string): string {
    const nombreBase = nombreOriginal.split('.')[0];
    const timestamp = new Date().getTime();
    return `${nombreBase}_converted_${timestamp}.${formato}`;
  }