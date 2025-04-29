import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { UIPage } from './page.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagesBoxService {
  private _pages: WritableSignal<Array<UIPage>> = signal([]);
  private _selectedPage: WritableSignal<number> = signal(0);
  
  private http = inject(HttpClient);
  
  public pageChanged = new Subject<UIPage>();

  constructor() {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.get('http://localhost:5000/dev-project', {headers: headers}).subscribe(
      (value: any) => {
        this._pages.set(value.pages);
        this.pageChanged.next(this.selectedPageData);
      }
    );
  }

  get pages(): WritableSignal<Array<UIPage>> {
    return this._pages;
  }

  get selectedPage(): WritableSignal<number> {
    return this._selectedPage;
  }

  get selectedPageData(): UIPage {
    return this.pages()[this.selectedPage()];
  }
}
