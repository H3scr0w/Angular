import {Component, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ngx-calculated-with',
  templateUrl: './calculated-with.component.html',
  styleUrls: ['./calculated-with.component.scss'],
})
/**
 * Component to display a list of used data for calculation
 * Displays "(1) Calculated with ...
 *           (2) Calculated with ...
 *           (X) Calculated with ..."
 */
export class CalculatedWithComponent {

  @Input() donneesReferences: any[];

  constructor(private translateService: TranslateService) {
  }

}
