import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { UiBoxComponent } from '../../shared/components/ui-box/ui-box.component';
import { LayersService } from '../../shared/services/layers.service';
import { Drawable } from '../../engine/drawables/drawable';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransformService } from '../../shared/services/transform.service';
import { Shape } from '../../engine/drawables/shape';

@Component({
    selector: 'uid-prop-box',
    imports: [UiBoxComponent, ReactiveFormsModule],
    templateUrl: './prop-box.component.html',
    styleUrl: './prop-box.component.scss'
})
export class PropBoxComponent implements OnInit {
  @Input() height: number = 50;

  private selectedLayer:  WritableSignal<Drawable | null> = signal(null);
  private layersService = inject(LayersService);
  private transformService = inject(TransformService);

  active: WritableSignal<boolean> = signal(false);
  props = new FormGroup({
    transform: new FormGroup({
      x: new FormControl(''),
      y: new FormControl(''),
      width: new FormControl(''),
      height: new FormControl(''),
      rotation: new FormControl(''),
      
    }),
    aspect: new FormGroup({
      fill: new FormControl(''),
      borderColor: new FormControl(''),
      borderSize: new FormControl(''),
      color: new FormControl(''),
      lineWidth: new FormControl('')
    })
  });
  
  ngOnInit(): void {
    this.layersService.layerClicked.subscribe((index: number | null) => {
      if (index !== null) {
        this.active.set(true);
        this.fillForm(index);
      } else {
        this.active.set(false);
      }
    });

    this.transformService.dragging.subscribe(() => {
      this.fillForm();
    });
  }

  private fillForm(index?: number | null): void {
    let drawable: any;
    
    if (index !== null && index !== undefined) {
      drawable = this.layersService.layers()[index];
    } else {
      drawable = this.selectedLayer();
    }
    
    const transform = this.props.controls.transform.controls;
    
    for (const key in transform) {
      const k = key as keyof typeof transform;
      transform[k].setValue(Math.round(drawable[k]).toString());
    }
    
    const aspect = this.props.controls.aspect.controls;
    for (const key in aspect) {
      const k = key as keyof typeof aspect;
      aspect[k].setValue(drawable[k]);
    }
    this.selectedLayer.set(drawable);

  }

  updateData(key: string): void {
    const transform = this.props.controls.transform.controls;
    const k = key as keyof typeof transform;
    const value = transform[k].value;
    const sl = this.selectedLayer();
    if (sl) {
        sl[k] = Number(value);
    }
    this.layersService.setTransformBox();
    this.layersService.requestRedraw.next();
  }
  
  updateAspect(key: string): void {
    const aspect = this.props.controls.aspect.controls;
    const k = key as keyof typeof aspect;
    const value: any = aspect[k].value;
    const sl = this.selectedLayer() as Shape;
    if (sl) {
      (sl as any)[k] = (k === 'borderSize' || k === 'lineWidth') ? Number(value) : value;
    }
    this.layersService.setTransformBox();
    this.layersService.requestRedraw.next();
  }

  getInstance() {
    if (this.selectedLayer()) {
      return this.selectedLayer()?.constructor.name.toLowerCase();
    } else {
      return null;
    }
  }
}
