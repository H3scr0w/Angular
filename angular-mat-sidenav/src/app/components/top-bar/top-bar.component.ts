import {
  AfterViewInit,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subject } from 'rxjs/internal/Subject';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SideBarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() sidenav: SideBarComponent;
  windowWidth$ = new Subject<number>();
  destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.windowWidth$
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((innerWidth) => {
        if (innerWidth < 600) {
          this.sidenav?.leftSidenav?.close();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth) {
      this.windowWidth$.next(event?.target?.innerWidth);
    }
  }
}
