import {Injectable} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {DeviceTypes} from '../enums';

@Injectable({
  providedIn: 'root',
})
export class MobileDetectorService {
  get deviceType(): DeviceTypes {
    return this._deviceType;
  }
  private readonly _deviceType: DeviceTypes;
  constructor(private deviceService: DeviceDetectorService) {
    if (this.deviceService.isDesktop()) {
      this._deviceType = DeviceTypes.DESKTOP;
    }
    if (this.deviceService.isMobile()) {
      this._deviceType = DeviceTypes.MOBILE;
    }
    if (this.deviceService.isTablet()) {
      this._deviceType = DeviceTypes.TABLET;
    }
  }
}
