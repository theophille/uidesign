import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SizesService } from '../../../shared/services/sizes.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'navbar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('navbar') navbarElement: ElementRef | undefined;
  documentName: string = 'NoNameProj'
  steps: Array<string> = ['Design', 'Animate', 'Prototype'];
  
  constructor(private sizesService: SizesService) {}

  ngAfterViewInit(): void {
    this.sizesService.navbarHeight = this.navbarElement?.nativeElement.offsetHeight;
  }
}
