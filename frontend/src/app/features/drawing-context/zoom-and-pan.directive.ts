import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { ZoomAndPanService } from './zoom-and-pan.service';

@Directive({
  selector: '[zoomAndPan]',
  standalone: true
})
export class ZoomAndPanDirective {

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D | null;
  private zoomAndPanService = inject(ZoomAndPanService);

  constructor(private el: ElementRef<HTMLCanvasElement>) { 
    this.canvas = el.nativeElement;
    this.context = el.nativeElement.getContext('2d');
    // console.log([].constructor.name);
  }

  @HostListener('mousedown', ['$event']) 
  onMouseDown(event: MouseEvent) {
    if (event.button == 1) {
      this.zoomAndPanService.panInit(event.offsetX, event.offsetY);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.zoomAndPanService.pan(event.offsetX, event.offsetY);
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.zoomAndPanService.panEnd();
  }

  @HostListener('mousewheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    this.zoomAndPanService.zoom(event.offsetX, event.offsetY, event.deltaY);
  }
  
}
