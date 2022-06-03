import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SlaInformation } from '../../models/sla-information';
import { EventEmitterService } from '../../service/event-emitter/event-emitter.service';

@Component({
  selector: 'stgo-sla-information',
  templateUrl: './sla-information.component.html',
  styleUrls: ['./sla-information.component.css']
})
export class SlaInformationComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  slaInfoCurrent: SlaInformation;
  @Output()
  slaInfoChanged = new EventEmitter<SlaInformation>();

  slaInfoForm = this.formBuilder.group({
    gtrCommitment: [''],
    dispoCommitment: [''],
    ltcCommitment: ['']
  });
  private sub$: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder, private eventEmitterService: EventEmitterService) {}

  ngOnInit() {
    if (this.slaInfoCurrent) {
      this.slaInfoForm.patchValue({
        gtrCommitment: this.slaInfoCurrent.gtrCommitment,
        dispoCommitment: this.slaInfoCurrent.dispoCommitment,
        ltcCommitment: this.slaInfoCurrent.ltcCommitment
      });
    }
    this.onChanges();

    if (this.eventEmitterService && this.eventEmitterService.invokeFormValidateFunction) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeFormValidateFunction.subscribe(() => {
        this.eventEmitterService.validStatus.push(this.validateForm());
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.slaInfoForm.patchValue({
      gtrCommitment: this.slaInfoCurrent.gtrCommitment,
      dispoCommitment: this.slaInfoCurrent.dispoCommitment,
      ltcCommitment: this.slaInfoCurrent.ltcCommitment
    });
  }

  onChanges(): void {
    this.sub$.add(
      this.slaInfoForm.valueChanges.subscribe(val => {
        const slaInfo: SlaInformation = Object.assign(this.slaInfoForm.value);
        this.slaInfoChanged.emit(slaInfo);
      })
    );
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  hasError(controlName: string, errorName: string): boolean {
    if (errorName === 'pattern' && !this.slaInfoForm.controls[controlName].hasError('required')) {
      return this.slaInfoForm.controls[controlName].hasError(errorName);
    }
    return this.slaInfoForm.controls[controlName].hasError(errorName) && this.slaInfoForm.controls[controlName].touched;
  }

  private validateForm(): boolean {
    if (this.slaInfoForm.invalid) {
      Object.keys(this.slaInfoForm.controls).forEach(key => {
        this.slaInfoForm.controls[key].markAllAsTouched();
      });
      return false;
    }
    return true;
  }
}
