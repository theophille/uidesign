import { Directive, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { TransformService } from '../../shared/services/transform.service';
import { LayersService } from '../../shared/services/layers.service';
import { ZoomAndPanService } from './zoom-and-pan.service';
import { Tool } from '../tools/tool.model';
import { CreateService } from '../tools/create.service';
import { TOOL_TYPES } from '../../engine/constants/constants';

@Directive({
  selector: '[uidDesignMode]',
  standalone: true
})
export class DesignModeDirective implements OnInit {

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D | null;
  private tool!: Tool;
  private canDragTransform: boolean = true;
  private cursor: string = 'default';
  private transformService = inject(TransformService);
  private layersService = inject(LayersService);
  private zoomService = inject(ZoomAndPanService);
  private createService = inject(CreateService);

  constructor(private el: ElementRef<HTMLCanvasElement>) { 
    this.canvas = el.nativeElement;
    this.context = el.nativeElement.getContext('2d');
  }

  ngOnInit(): void {
    this.layersService.selectedTool.subscribe((t: Tool) => {
      this.tool = t;

      if (t.tool === TOOL_TYPES.rectangle) {
        this.cursor = 'crosshair';
      } else if (t.tool === TOOL_TYPES.rectangle) {
        this.cursor = 'crosshair';
      } else if (t.tool === TOOL_TYPES.ellipse) {
        this.cursor = 'crosshair';
      } else if (t.tool === TOOL_TYPES.line) {
        this.cursor = 'crosshair';
      } else {
        this.cursor = 'default';
      }

      const createTools = ['rectangle', 'ellipse', 'polygon', 'line', 'pen', 'text'];
      this.canDragTransform = !createTools.includes(this.tool.tool);

      if (!this.canDragTransform) {
        this.layersService.layerClicked.next(null);
      }

      this.canvas.style.cursor = this.cursor;
    })
  }

  private mouseDebugging(event: MouseEvent): void {
    const offset = this.zoomService.getOffset();
    const scale = this.zoomService.getScale();
    const mouse = {
      x: (event.offsetX - offset.x) / scale,
      y: (event.offsetY - offset.y) / scale
    };
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      if (!this.canDragTransform) {
        this.createService.createInit(event.offsetX, event.offsetY);
        return;
      }

      if (this.transformService.overControl !== null) {
        this.transformService.transformInit(event.offsetX, event.offsetY);
        return;
      }

      this.transformService.onSelection(event.offsetX, event.offsetY, this.context as CanvasRenderingContext2D);

      if (this.layersService.transformBox?.isPointInside(this.context as CanvasRenderingContext2D, event.offsetX, event.offsetY)) {
        this.transformService.dragInit(event.offsetX, event.offsetY);
      }
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.createService.isCreating) {
      this.createService.renderBoundingBox(event.offsetX, event.offsetY);
      return;
    }
    
    if (this.transformService.isTransforming) {
      this.transformService.transform(event.offsetX, event.offsetY);
      return;
    }

    this.transformService.onHoverControlPoint(event.offsetX, event.offsetY, this.context as CanvasRenderingContext2D, this.canvas);

    if (this.transformService.isDragging) {
      this.transformService.drag(event.offsetX, event.offsetY);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (this.createService.isCreating) {
      this.createService.createEnd(event.offsetX, event.offsetY, this.tool);
    }

    if (this.transformService.isDragging) {
      this.transformService.dragEnd();
      return;
    }

    if (this.transformService.isTransforming) {
      this.transformService.endTransform();
      return;
    }
  }
}
