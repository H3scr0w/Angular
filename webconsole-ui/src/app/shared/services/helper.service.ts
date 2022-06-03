import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Command } from '../models/command.model';

@Injectable({ providedIn: 'root' })
export class HelperService {
  moveDown(cmd: Command, dataSource: MatTableDataSource<Command>): MatTableDataSource<Command> {
    const ELEMENT_DATA = dataSource.data;
    const index = ELEMENT_DATA.indexOf(cmd);
    if (index < ELEMENT_DATA.length - 1) {
      const b = ELEMENT_DATA[index];
      ELEMENT_DATA[index] = ELEMENT_DATA[index + 1];
      ELEMENT_DATA[index + 1] = b;
      ELEMENT_DATA[index].order = cmd.order;
      ELEMENT_DATA[index + 1].order = cmd.order + 1;
      dataSource = new MatTableDataSource(ELEMENT_DATA);
    }
    return dataSource;
  }

  moveUp(cmd: Command, dataSource: MatTableDataSource<Command>): MatTableDataSource<Command> {
    const ELEMENT_DATA = dataSource.data;
    const index = ELEMENT_DATA.indexOf(cmd);
    if (index > 0) {
      const b = ELEMENT_DATA[index];
      ELEMENT_DATA[index] = ELEMENT_DATA[index - 1];
      ELEMENT_DATA[index - 1] = b;
      ELEMENT_DATA[index - 1].order = index;
      ELEMENT_DATA[index].order = index + 1;
      dataSource = new MatTableDataSource(ELEMENT_DATA);
    }
    return dataSource;
  }
}
