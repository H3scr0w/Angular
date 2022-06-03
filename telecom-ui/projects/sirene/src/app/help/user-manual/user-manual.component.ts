import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UserManual, UserManualService } from '@shared';

@Component({
  selector: 'stgo-user-manual',
  templateUrl: './user-manual.component.html',
  styleUrls: ['./user-manual.component.scss']
})
export class UserManualComponent implements OnInit {
  userManuals: UserManual[];
  currentLang: string;

  constructor(private translateService: TranslateService, private userManualService: UserManualService) {}

  ngOnInit() {
    this.currentLang = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
    });
    this.getUserManuals();
  }

  private getUserManuals(): void {
    this.userManuals = this.userManualService.getAllUserManuals();
  }
}
