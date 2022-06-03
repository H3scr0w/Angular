import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../core/webconsole/app.state';
import { DataSourceTechnical } from '../../../shared/models/datasource-technical.model';

@Component({
  selector: 'stgo-wsip-technical',
  templateUrl: './wsip-technical.component.html',
  styleUrls: ['./wsip-technical.component.css']
})
export class WsipTechnicalComponent implements OnInit {
  displayedColumnsTechnical: string[] = ['label', 'value'];
  dataSourceTechnical$: Observable<DataSourceTechnical[]>;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.dataSourceTechnical$ = this.store.pipe(
      select((state) => state && state.website && state.website.datasourceTechnical)
    );
  }
}
