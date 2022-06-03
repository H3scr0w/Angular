import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AuthService} from './core/services/auth.service';
import {Title} from '@angular/platform-browser';
import {CookieService} from 'ngx-cookie-service';


@Component({
  selector: 'ngx-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend-caf';

  constructor(private translate: TranslateService, private spinner: NgxSpinnerService,
              private authService: AuthService, private titleService: Title) {
    translate.setDefaultLang('fr-FR');
    translate.get('application.pageTitle').subscribe(value => {
      this.titleService.setTitle(value);
    });
  }

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    this.authService.getUserInfoAndSetCookies().subscribe((val) => {
      this.authService.setCurrentUser(val.userinfo.sub).subscribe(() => {
        this.spinner.hide();
      },  () => {
        this.spinner.hide();
      });
    }, () => {
      this.spinner.hide();
    });
  }
}
