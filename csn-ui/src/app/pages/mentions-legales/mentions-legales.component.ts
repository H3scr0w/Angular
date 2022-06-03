import {Component, OnInit} from '@angular/core';
import {Ng7BootstrapBreadcrumbService} from 'ng7-bootstrap-breadcrumb';
import {TranslateService} from '@ngx-translate/core';
import {MentionsLegalesService} from './shared/mentions-legales.service';
import {MentionsLegalesModel} from './shared/mentions-legales.model';

@Component({
  selector: 'ngx-app-mentions-legales',
  templateUrl: './mentions-legales.component.html',
  styleUrls: ['./mentions-legales.component.scss'],
})
export class MentionsLegalesComponent implements OnInit {

  model: MentionsLegalesModel;
  constructor(private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
    private translateService: TranslateService,
              private mentionsLegalesService: MentionsLegalesService) { }

  ngOnInit() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.translateService.get('common.accueil').subscribe(res => {
      this.translateService.get('mentionsLegales.title').subscribe(res2 => {
        const breadcrumb = { accueil: res, mentionsLegales: res2 };
        this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
      });
    });
    this.mentionsLegalesService.get().subscribe(res => {
      this.model = res;
    });
  }

}
