import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { menuList } from './menu-list';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  @ViewChild('leftSidenav') leftSidenav: MatSidenav;

  sideMenu = menuList;
  collapse = true;

  constructor() {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.collapse = false;
  }

  hideSidebar() {
    this.collapse = true;
  }
}
