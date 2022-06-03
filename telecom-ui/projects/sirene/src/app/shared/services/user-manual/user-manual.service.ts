import { Injectable } from '@angular/core';
import { UserManual } from '../../models/user-manual';

export interface IUserManualService {
  getAllUserManuals(): UserManual[];
}

@Injectable({
  providedIn: 'root'
})
export class UserManualService implements IUserManualService {
  constructor() {}

  getAllUserManuals(): UserManual[] {
    const userManuals: UserManual[] = [];
    userManuals.push(new UserManual(1, 'Sheet_En_1.pdf', 'Sheet_Fr_1.pdf'));
    userManuals.push(new UserManual(2, 'Sheet_En_2.pdf', 'Sheet_Fr_2.pdf'));
    userManuals.push(new UserManual(3, 'Sheet_En_3.pdf', 'Sheet_Fr_3.pdf'));
    userManuals.push(new UserManual(4, 'Sheet_En_4.pdf', 'Sheet_Fr_4.pdf'));
    userManuals.push(new UserManual(5, 'Sheet_En_5.pdf', 'Sheet_Fr_5.pdf'));
    userManuals.push(new UserManual(6, 'Sheet_En_6.pdf', 'Sheet_Fr_6.pdf'));
    userManuals.push(new UserManual(7, 'Sheet_En_7.pdf', 'Sheet_Fr_7.pdf'));
    userManuals.push(new UserManual(8, 'Sheet_En_8.pdf', 'Sheet_Fr_8.pdf'));
    userManuals.push(new UserManual(9, 'Sheet_En_9.pdf', 'Sheet_Fr_9.pdf'));
    userManuals.push(new UserManual(10, 'Sheet_En_10.pdf', 'Sheet_Fr_11.pdf'));
    userManuals.push(new UserManual(11, 'Sheet_En_11.pdf', 'Sheet_Fr_12.pdf'));
    userManuals.push(new UserManual(12, 'Sheet_En_12.pdf', 'Sheet_Fr_13.pdf'));
    userManuals.push(new UserManual(13, 'Sheet_En_13.pdf', 'Sheet_Fr_14.pdf'));
    userManuals.push(new UserManual(14, 'Sheet_En_14.pdf', 'Sheet_Fr_15.pdf'));
    userManuals.push(new UserManual(15, 'Sheet_En_15.pdf', 'Sheet_Fr_16.pdf'));
    userManuals.push(new UserManual(16, 'Sheet_En_16.pdf', 'Sheet_Fr_17.pdf'));
    userManuals.push(new UserManual(17, 'Sheet_En_17.pdf', 'Sheet_Fr_18.pdf'));
    return userManuals;
  }
}
