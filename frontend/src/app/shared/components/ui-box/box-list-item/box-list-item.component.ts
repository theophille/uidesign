import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'uid-box-list-item',
    imports: [CommonModule],
    templateUrl: './box-list-item.component.html',
    styleUrl: './box-list-item.component.scss'
})
export class BoxListItemComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() active: boolean = false;
  @Input() actions: boolean = false;
}
