import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService, Credentials } from '@core';
import { EmailTemplatesService } from '../shared/service/email-templates/email-templates.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

/**
 * The Home component
 */
@Component({
  selector: 'stgo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * The credentials
   */
  credentials: Credentials;

  isLoading = false;

  date: Date = new Date();

  private sub$: Subscription = new Subscription();

  /**
   * Instantiate the component
   *
   * @param authenticationService the authentication service
   */
  constructor(
    private authenticationService: AuthenticationService,
    private emailTemplatesService: EmailTemplatesService,
    private http: HttpClient) { }

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    this.credentials = this.authenticationService.credentials;
    this.getEmailTemplates();
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  downloadManual(): void {
    const url = window.location.origin + '/assets/Guide Utilisateur - Correspondant PCPEG 2020.pdf';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    this.sub$.add(
      this.http.get(url, { headers, responseType: 'blob' }).subscribe((res) => {
        const blob = new Blob([res], { type: 'application/octet-stream' });
        saveAs(blob, 'Guide Utilisateur - Correspondant PCPEG 2020.pdf');
      })
    );
  }

  private getEmailTemplates(): void {
    this.isLoading = true;
    this.sub$.add(
      this.emailTemplatesService
        .getEmailTemplateById('1')
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((result) => {
          if (result) {
            if (result.formulaireDateLimiteReponse) {
              this.date = result.formulaireDateLimiteReponse;
            }
          }
        })
    );
  }
}
