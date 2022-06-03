import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SharedMenuService } from '../core/services/shared-menu.service';
import { ConstantMenu, Menu } from '../shared/menu-constant';

@Component({
  selector: 'stgo-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  menu: Menu = ConstantMenu.ADMIN_MENU;

  constructor(private sharedMenuService: SharedMenuService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sharedMenuService.emitChange(this.menu);
  }
}
