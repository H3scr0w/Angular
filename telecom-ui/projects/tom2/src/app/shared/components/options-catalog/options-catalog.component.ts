import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { DynamicControlBase } from '../../classes/dynamic-control-base';
import { DynamicControlService } from '../../service/dynamic-control/dynamic-control.service';

@Component({
  selector: 'stgo-options-catalog',
  templateUrl: './options-catalog.component.html',
  styleUrls: ['./options-catalog.component.css']
})
export class OptionsCatalogComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  dynamicControls: DynamicControlBase<any>[] = [];
  @Input()
  isReadOnly = true;
  @Output()
  catalogOptionChanged = new EventEmitter<any>();

  catalogOptionsForm: FormGroup;
  formCreated: Subject<boolean> = new Subject();
  private sub$: Subscription = new Subscription();
  constructor(private dynamicControlService: DynamicControlService) {}

  ngOnInit() {
    this.formCreated.subscribe(data => {
      if (data) {
        this.sub$.add(
          this.catalogOptionsForm.valueChanges.subscribe(val => {
            this.catalogOptionChanged.emit(this.catalogOptionsForm.value);
          })
        );
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dynamicControls && this.dynamicControls.length > 0) {
      this.catalogOptionsForm = this.dynamicControlService.toFormGroup(this.dynamicControls);
      this.formCreated.next(true);
      this.catalogOptionChanged.emit(this.catalogOptionsForm.value);
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }
}
