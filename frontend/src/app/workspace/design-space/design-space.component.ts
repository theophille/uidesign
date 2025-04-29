import { Component } from '@angular/core';
import { PagesBoxComponent } from '../../features/pages-box/pages-box.component';
import { LayersComponent } from '../../features/layers/layers.component';
import { PropBoxComponent } from '../../features/prop-box/prop-box.component';
import { ColorPaletteComponent } from '../../features/color-palette/color-palette.component';
import { ToolsComponent } from '../../features/tools/tools.component';
import { DrawingContextComponent } from '../../features/drawing-context/drawing-context.component';

@Component({
  selector: 'design-space',
  standalone: true,
  imports: [
    PagesBoxComponent,
    LayersComponent,
    PropBoxComponent,
    ColorPaletteComponent,
    ToolsComponent,
    DrawingContextComponent
  ],
  templateUrl: './design-space.component.html',
  styleUrl: './design-space.component.scss'
})
export class DesignSpaceComponent {
  constructor() {}
}
