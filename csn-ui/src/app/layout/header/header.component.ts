import {Component, HostListener, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {environment} from '../../../environments/environment';
import {ApiNotarialeGender} from '../../shared/enums';

@Component({
  selector: 'ngx-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  status: boolean = false;
  user: any;
  adminUrl: string;
  monCompteUrl: string;
  notAccessUrl: string;
  statusUser: boolean;
  statusAction: boolean;

  constructor(private translate: TranslateService, private router: Router,
              private authService: AuthService) {
    this.authService.currentUser.subscribe(currentUser => {
      if (currentUser) {
        this.user = {
          id: currentUser.uid,
          firstName: currentUser.ctmPrenom,
          lastName: currentUser.ctmNomUsuel,
          gender: currentUser.ctmSexe,
          isAdmin: currentUser.isAdmin,
          officeName: currentUser.officeName,
        };
        this.user.picture = currentUser.jpegPhoto;
        if (!this.user.picture) {
          if (currentUser.ctmSexe.toLowerCase() === ApiNotarialeGender.MAN) {
            this.user.picture = '/assets/images/ic_user_default_man.png';
          } else {
            this.user.picture = '/assets/images/ic_user_default_woman.png';
          }
        }
      }
    });
  }

  ngOnInit() {
    this.adminUrl = environment.adminUrl;
    this.notAccessUrl = environment.notaccessUrl;
    this.monCompteUrl = environment.monCompteUrl;
  }

  toggleStatusUser($event: MouseEvent) {
    this.statusUser = !this.statusUser;
    this.statusAction = false;
    if (this.statusUser) {
      $event.stopPropagation();
    }
  }

  toggleStatusAction($event: MouseEvent) {
    this.statusAction = !this.statusAction;
    this.statusUser = false;
    if (this.statusAction) {
      $event.stopPropagation();
    }
  }

  @HostListener('window:click', ['$event'])
  removeClass(e: MouseEvent) {
    this.statusUser = false;
    this.statusAction = false;
  }

  logOut() {
    this.authService.logOut();
  }
}
