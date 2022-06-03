import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SharedMenuService } from '../core/services/shared-menu.service';
import { ConstantMenu, Menu } from '../shared/menu-constant';

@Component({
  selector: 'stgo-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit, AfterViewInit {
  menu: Menu = ConstantMenu.WEBSITE_MENU;

  constructor(private sharedMenuService: SharedMenuService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sharedMenuService.emitChange(this.menu);
  }
}
