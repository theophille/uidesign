import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  keysPressed: Array<string> = [];
  keyDown = new Subject<string>();

  addKey(key: string): void {
    this.keysPressed.push(key);
  }
  
  removeKey(key: string): void {
    const i = this.keysPressed.indexOf(key);
    this.keysPressed.splice(i, 1);
  }

  isPressed(key: string): boolean {
    return this.keysPressed.includes(key);
  }
}
