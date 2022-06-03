import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DynamicControlBase } from '../../classes/dynamic-control-base';
import { DynamicControlService } from '../../service/dynamic-control/dynamic-control.service';

@Component({
  selector: 'stgo-information-items',
  templateUrl: './information-items.component.html',
  styleUrls: ['./information-items.component.css']
})
export class InformationItemsComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  dynamicControls: DynamicControlBase<any>[] = [];
  @Output()
  infoItemsChanged = new EventEmitter<any>();

  informationItemsForm: FormGroup;
  private sub$: Subscription = new Subscription();
  constructor(private dynamicControlService: DynamicControlService) {}

  ngOnInit() {
    if (this.dynamicControls && this.dynamicControls.length > 0) {
      this.informationItemsForm = this.dynamicControlService.toFormGroup(this.dynamicControls);

      this.sub$.add(
        this.informationItemsForm.valueChanges.subscribe(val => {
          this.infoItemsChanged.emit(this.informationItemsForm.value);
        })
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dynamicControls && this.dynamicControls.length > 0) {
      this.informationItemsForm = this.dynamicControlService.toFormGroup(this.dynamicControls);
      this.infoItemsChanged.emit(this.informationItemsForm.value);
    }
  }

  trackByFn({ index, item }: any) {
    if (item) {
      return item;
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }
}
