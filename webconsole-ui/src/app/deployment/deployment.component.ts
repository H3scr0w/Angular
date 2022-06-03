import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SharedMenuService } from '../core/services/shared-menu.service';
import { ConstantMenu, Menu } from '../shared/menu-constant';

@Component({
  selector: 'stgo-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.css']
})
export class DeploymentComponent implements OnInit, AfterViewInit {
  menu: Menu = ConstantMenu.DEPLOYMENT_MENU;

  constructor(private sharedMenuService: SharedMenuService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sharedMenuService.emitChange(this.menu);
  }
}
