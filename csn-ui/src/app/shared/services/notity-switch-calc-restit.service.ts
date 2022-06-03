import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CalculType, RestitType, CalculWithRestit } from 'src/app/pages/usufruit/shared/calcul-with-restit.model';

@Injectable()
export class NotifySwitchCalcRestitService {

  private calculResultModel = new Subject<CalculWithRestit>();

  private print = new Subject<boolean>();

  private switchNotifiedSource = new Subject<any>();

  switchNotifiedSource$ = this.switchNotifiedSource.asObservable();

  calculResultModel$ = this.calculResultModel.asObservable();

  print$ = this.print.asObservable();

  notifySwitch(result: any) {
    this.switchNotifiedSource.next(result);
  }

  notifyCalculResultModel(calculResult: CalculWithRestit): void {
    this.calculResultModel.next(calculResult);
  }

  notifyPrint(doPrint: boolean): void {
    this.print.next(doPrint);
  }


}
