import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ToolsService } from './tools.service';
import { Tool } from './tool.model';
import { CommonModule } from '@angular/common';
import { LayersService } from '../../shared/services/layers.service';

@Component({
    selector: 'uid-tools',
    imports: [CommonModule],
    templateUrl: './tools.component.html',
    styleUrl: './tools.component.scss'
})
export class ToolsComponent implements OnInit {
  tools: WritableSignal<Array<Tool>> = signal([]);
  activeTool!: WritableSignal<number>;
  layersService = inject(LayersService);

  constructor(private toolsService: ToolsService) {}

  ngOnInit(): void {
    this.tools.set(this.toolsService.getTools());
    this.activeTool = this.toolsService.getActiveTool();
  }

  onToolClick(toolIndex: any): void {
    this.activeTool.set(toolIndex);
    this.layersService.selectedTool.next(this.tools()[this.activeTool()]);
  }
}
