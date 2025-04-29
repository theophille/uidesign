import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SizesService {
  private _navbarHeight!: number;
  private _boxGroupWidth: number = 318;

  get navbarHeight() {
    return this._navbarHeight;
  }

  set navbarHeight(height: number) {
    this._navbarHeight = height;
  }

  get boxGroupWidth() {
    return this._boxGroupWidth;
  }

  set boxGroupWidth(width: number) {
    this._boxGroupWidth = width;
  }
}
