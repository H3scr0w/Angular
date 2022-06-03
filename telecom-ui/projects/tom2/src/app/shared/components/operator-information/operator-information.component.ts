import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DynamicControlBase } from '../../classes/dynamic-control-base';
import { DynamicControlService } from '../../service/dynamic-control/dynamic-control.service';

@Component({
  selector: 'stgo-operator-information',
  templateUrl: './operator-information.component.html',
  styleUrls: ['./operator-information.component.css']
})
export class OperatorInformationComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  dynamicControls: DynamicControlBase<any>[] = [];
  @Output()
  operatorInfoChanged = new EventEmitter<any>();

  operatorInfoForm: FormGroup;
  private sub$: Subscription = new Subscription();
  constructor(private dynamicControlService: DynamicControlService) {}

  ngOnInit() {
    if (this.dynamicControls && this.dynamicControls.length > 0) {
      this.operatorInfoForm = this.dynamicControlService.toFormGroup(this.dynamicControls);
      this.sub$.add(
        this.operatorInfoForm.valueChanges.subscribe(val => {
          this.operatorInfoChanged.emit(this.operatorInfoForm.value);
        })
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dynamicControls && this.dynamicControls.length > 0) {
      this.operatorInfoForm = this.dynamicControlService.toFormGroup(this.dynamicControls);
      this.operatorInfoChanged.emit(this.operatorInfoForm.value);
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
