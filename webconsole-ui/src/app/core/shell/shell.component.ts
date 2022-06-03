import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Menu } from '../../shared/menu-constant';
import { routerTransition } from '../animations/router.transition';
import { SharedMenuService } from '../services/shared-menu.service';

/**
 * The Shell component
 */
@Component({
  selector: 'stgo-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  animations: [routerTransition]
})
export class ShellComponent implements OnInit, AfterViewInit {
  menu: Menu;

  /**
   * Instantiate the componennt
   */
  constructor(
    private sharedMenuService: SharedMenuService,
    private cdRef: ChangeDetectorRef) {}

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    this.sharedMenuService.changeEmitted$.subscribe((menu) => (this.menu = menu));
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }
}
