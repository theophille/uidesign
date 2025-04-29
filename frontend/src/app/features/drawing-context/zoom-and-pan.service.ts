import { inject, Injectable } from '@angular/core';
import { Vec2 } from '../../engine/utils/math.utils';
import { Subject } from 'rxjs';
import { LayersService } from '../../shared/services/layers.service';

@Injectable({
  providedIn: 'root'
})
export class ZoomAndPanService {
  private offset: Vec2 = { x: 0, y: 0 };
  private scale: number = 1;
  private ZOOM_FACTOR: number = 0.1;
  private panStart: Vec2 | null = null;
  private isPanning: boolean = false;
  
  public viewChanged = new Subject<void>();
  
  panInit(mouseX: number, mouseY: number): void {
    this.isPanning = true;
    this.panStart = {
      x: mouseX,
      y: mouseY
    }
  }

  pan(mouseX: number, mouseY: number): void {
    if (this.isPanning) {
      const d: Vec2 = {
        x: mouseX - this.panStart!.x,
        y: mouseY - this.panStart!.y
      }

      this.offset.x += d.x;
      this.offset.y += d.y;

      this.panStart = {
        x: mouseX,
        y: mouseY
      }

      this.viewChanged.next();
    }
  }

  panEnd(): void {
    this.isPanning = false;
    this.panStart = {
      x: 0,
      y: 0
    }
  }

  zoom(mouseX: number, mouseY: number, deltaY: number): void {
    const previousScale = this.scale;

    if (deltaY > 0) {
      this.scale = Math.max(0.1, this.scale - this.ZOOM_FACTOR);
    } else {
      this.scale = Math.min(10, this.scale + this.ZOOM_FACTOR);
    }

    const scaleDiff = this.scale - previousScale;
    this.offset.x -= (mouseX - this.offset.x) * scaleDiff / this.scale;
    this.offset.y -= (mouseY - this.offset.y) * scaleDiff / this.scale;
  
    this.viewChanged.next();
  }

  setOffset(offset: Vec2): void {
    this.offset = offset;
  }

  getOffset(): Vec2 {
    return this.offset;
  }

  setScale(scale: number): void {
    this.scale = scale;
  }

  getScale(): number {
    return this.scale;
  }

  setTranform(t: { scale: number, offset: Vec2 }): void {
    this.offset = t.offset;
    this.scale = t.scale;
  }

  resetScale(): void {
    this.scale = 1;
  }

  getViewTransform() {
    return {
      offset: this.offset,
      scale: this.scale
    };
  }
}
