import { Component, OnInit } from '@angular/core';
import { AuthenticationService, Credentials } from '@core';

/**
 * The Home component
 */
@Component({
  selector: 'stgo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /**
   * The credentials
   */
  credentials: Credentials;

  /**
   * Instantiate the component
   */
  constructor(private authenticationService: AuthenticationService) {}

  /**
   * Initialize the component
   */
  ngOnInit() {
    this.credentials = this.authenticationService.credentials;
  }
}
