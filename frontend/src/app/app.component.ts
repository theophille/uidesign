import { AfterViewInit, Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesignSpaceComponent } from './workspace/design-space/design-space.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { SizesService } from './shared/services/sizes.service';
import { KeyboardService } from './core/services/keyboard.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, DesignSpaceComponent, NavbarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  @ViewChild(NavbarComponent) navComponent!: NavbarComponent;
  @ViewChild('content') contentElement!: ElementRef;
  title = 'ui.design';
  keyboardService = inject(KeyboardService);

  constructor(private sizesService: SizesService) {}

  ngAfterViewInit(): void {
    this.setContentHeight();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.setContentHeight();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.keyboardService.keyDown.next(event.key);
    if (!this.keyboardService.keysPressed.includes(event.key)) {
      this.keyboardService.addKey(event.key);
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.keyboardService.removeKey(event.key);
  }

  setContentHeight(): void {
    const navHeight: number = this.sizesService.navbarHeight;
    const contentHeight: number = window.innerHeight - navHeight - 5;
    this.contentElement.nativeElement.style.height = `${contentHeight}px`;
  }
}
