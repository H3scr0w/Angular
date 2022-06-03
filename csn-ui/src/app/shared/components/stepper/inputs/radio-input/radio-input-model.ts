import {FormControl} from '@angular/forms';
import {RadioInputWarnMsgModel} from './radio-input-warn-msg.model';

export class RadioInputModel {
  labelId: string;
  labelKey: string;
  ctrlId: string;
  ctrlValue: string;
  imageName: string;
  inputCtrl: FormControl;
  warningMsgsModel?: RadioInputWarnMsgModel;

  constructor(labelKey: string,
              labelId: string,
              ctrlValue: string,
              imageName: string,
              warningMsgsModel?: RadioInputWarnMsgModel) {
    this.labelId = labelId;
    this.labelKey = labelKey;
    this.ctrlId = 'input_' + ctrlValue;
    this.ctrlValue = ctrlValue;
    this.imageName = imageName;
    this.warningMsgsModel = warningMsgsModel;
  }

}
