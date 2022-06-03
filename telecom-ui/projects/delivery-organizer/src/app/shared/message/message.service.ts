import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface IMessageService {
  show(message: string, panelClass: string): void;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService implements IMessageService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, panelClass: string = 'success'): void {
    this.snackBar.open(message, '', {
      duration: 4000,
      panelClass,
      verticalPosition: 'top',
      horizontalPosition: 'end'
    });
  }
}
