import { Component, Input } from '@angular/core';
import { UiBoxComponent } from '../../shared/components/ui-box/ui-box.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uid-color-palette',
  standalone: true,
  imports: [UiBoxComponent, CommonModule],
  templateUrl: './color-palette.component.html',
  styleUrl: './color-palette.component.scss'
})
export class ColorPaletteComponent {
  @Input() height: number = 50;
  colors!: string[];

  fileChanged(event: any): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const image = new Image();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context?.drawImage(image, 0, 0, image.width, image.height);
        const colors = this.extractColors(5, canvas, context as CanvasRenderingContext2D);
        this.colors = colors;
      }
    }
  }

  private extractColors(count: number, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): string[] {
    const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return [];

    const data = imageData.data;
    const colorCounts: { [key: string]: number } = {};

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const color = `rgb(${r},${g},${b})`;

        if (colorCounts[color]) {
            colorCounts[color]++;
        } else {
            colorCounts[color] = 1;
        }
    }

    const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(color => color[0]);

    return sortedColors;
  }

  rgbStringToHex(rgb: string): string {
    const result = rgb.match(/\d+/g);
    
    if (result && result.length === 3) {
        const r = parseInt(result[0], 10);
        const g = parseInt(result[1], 10);
        const b = parseInt(result[2], 10);

        const hexR = Math.max(0, Math.min(255, r)).toString(16).padStart(2, '0');
        const hexG = Math.max(0, Math.min(255, g)).toString(16).padStart(2, '0');
        const hexB = Math.max(0, Math.min(255, b)).toString(16).padStart(2, '0');

        return `#${hexR}${hexG}${hexB}`;
    } else {
        throw new Error('Invalid RGB format');
    }
}
}
