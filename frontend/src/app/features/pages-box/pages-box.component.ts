import { Component, inject, Input, OnInit, WritableSignal } from '@angular/core';
import { UiBoxComponent } from '../../shared/components/ui-box/ui-box.component';
import { PagesBoxService } from './pages-box.service';
import { UIPage } from './page.model';
import { BoxListItemComponent } from '../../shared/components/ui-box/box-list-item/box-list-item.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'uid-pages-box',
    imports: [CommonModule, UiBoxComponent, BoxListItemComponent],
    templateUrl: './pages-box.component.html',
    styleUrl: './pages-box.component.scss'
})
export class PagesBoxComponent implements OnInit{
  @Input() height: number = 50;
  
  private _pages!: WritableSignal<Array<UIPage>>;
  selectedPage!: WritableSignal<number>;
  
  private pagesService = inject(PagesBoxService);
  
  ngOnInit(): void {
    this._pages = this.pagesService.pages;
    this.selectedPage = this.pagesService.selectedPage;
  }

  get pages(): Array<UIPage> {
    return this._pages();
  }

  getPageLabel(page: UIPage): string {
    return `${page.name} - ${page.width} x ${page.height}`;
  }

  onPageSelect(index: number): void {
    this.selectedPage.set(index);
    this.pagesService.pageChanged.next(this.pagesService.selectedPageData);
  }
}
