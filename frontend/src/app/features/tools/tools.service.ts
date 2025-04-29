import { Injectable, signal, WritableSignal } from '@angular/core';
import { Tool } from './tool.model';
import { TOOLS } from '../../engine/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  private activeTool: WritableSignal<number> = signal(0);
  
  private tools: Array<Tool> = TOOLS;

  getActiveTool(): WritableSignal<number> {
    return this.activeTool;
  }

  setActiveTool(activeToolIndex: number): void {
    this.activeTool.set(activeToolIndex);
  }

  getTools(): Array<Tool> {
    return this.tools;
  }
}
