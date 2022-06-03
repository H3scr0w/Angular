import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Menu } from '../../shared/menu-constant';

@Injectable({
  providedIn: 'root'
})
export class SharedMenuService {
  // Observable string sources
  private emitChangeSource = new Subject<Menu>();

  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();

  constructor() {}

  // Service message commands
  emitChange(change: Menu): void {
    this.emitChangeSource.next(change);
  }
}
