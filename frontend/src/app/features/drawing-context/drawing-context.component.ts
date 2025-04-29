import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild, WritableSignal } from '@angular/core';
import { SizesService } from '../../shared/services/sizes.service';
import { ZoomAndPanDirective } from './zoom-and-pan.directive';
import { ZoomAndPanService } from './zoom-and-pan.service';
import { PagesBoxService } from '../pages-box/pages-box.service';
import { UIPage } from '../pages-box/page.model';
import { Layers, LayersService } from '../../shared/services/layers.service';
import { DesignModeDirective } from './design-mode.directive';
import { Drawable } from '../../engine/drawables/drawable';
import { ToolsService } from '../tools/tools.service';
import { Tool } from '../tools/tool.model';
import { CreateService } from '../tools/create.service';
import { ShaderProgram } from '../../graphics_engine/shaders/shader';
import { simpleVS } from '../../graphics_engine/shaders/vertex/simple';
import { simpleFS } from '../../graphics_engine/shaders/fragment/simple';

@Component({
  selector: 'uid-drawing-context',
  standalone: true,
  templateUrl: './drawing-context.component.html',
  styleUrl: './drawing-context.component.scss'
})
export class DrawingContextComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') private canvas!: ElementRef<HTMLCanvasElement>;
  
  private context!: WebGL2RenderingContext | null;
  private pageData!: UIPage;
  private layers!: WritableSignal<Layers>;
  private tool!: Tool;
  private cursor: string = 'default';

  private zoomAndPanService = inject(ZoomAndPanService);
  private sizesService = inject(SizesService);
  private pagesService = inject(PagesBoxService);
  private layersService = inject(LayersService);
  private createService = inject(CreateService);
  private shader!: ShaderProgram;
  private vertices!: Float32Array;
  private VAO!: WebGLVertexArrayObject;
  private VBO!: WebGLBuffer;

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.setCanvasSize();
    this.context = this.canvas.nativeElement.getContext('webgl2', { antialias: true });
    console.log(this.context);
    this.shader = new ShaderProgram(this.context as WebGL2RenderingContext, simpleVS, simpleFS);
    this.vertices = new Float32Array([
      -0.5, -0.5, 0.0, 
      0.5, -0.5, 0.0,
      0.0,  0.5, 0.0
    ]);
    this.context = this.context as WebGL2RenderingContext;
    this.VAO = this.context.createVertexArray() as WebGLVertexArrayObject;
    this.VBO = this.context.createBuffer() as WebGLBuffer;
    this.context.bindVertexArray(this.VAO);
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.VBO);
    this.context.bufferData(this.context.ARRAY_BUFFER, this.vertices, this.context.STATIC_DRAW);
    this.context.vertexAttribPointer(0, 3, this.context.FLOAT, false, 0, 0);
    this.context.enableVertexAttribArray(0);
    this.context.viewport(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.draw();
  }

  private draw(): void {
    this.context = this.context as WebGL2RenderingContext;
    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.context.clear(this.context.COLOR_BUFFER_BIT);
    this.shader.use();
    this.context.bindVertexArray(this.VAO);
    this.context.drawArrays(this.context.TRIANGLES, 0, 3);
  }
  
  private setCanvasSize(): void {
    const navHeight: number = this.sizesService.navbarHeight;
    const contentHeight: number = window.innerHeight - navHeight - 5;
    this.canvas.nativeElement.height = contentHeight;
    this.canvas.nativeElement.width = window.innerWidth - 2 * this.sizesService.boxGroupWidth - 10;
  }

  

  @HostListener('window:resize')
  onResize(): void {
    this.setCanvasSize();
    this.draw();
  }
}
