import { Component, OnInit } from '@angular/core';
import { Logger } from '@core';
import { environment } from '@env/environment';

/**
 * The logger
 */
const log = new Logger('App');

/**
 * The app component
 */
@Component({
  selector: 'stgo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /**
   * Instantiate the component
   */
  constructor() {}

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');
  }
}
