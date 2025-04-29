import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'uid-ui-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-box.component.html',
  styleUrl: './ui-box.component.scss'
})
export class UiBoxComponent {
  @Input() headerLabel: string = '';
  @Input() headerIcon: string = '';
  @Input() actions: boolean = false;
  @Input() height: number = 50;

  calculateHeight(height: number): string {
    return `calc(${height}% - 2.5px)`;
  }
}
