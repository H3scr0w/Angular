import {Injectable} from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportService {

  constructor() { }

  downloadFile(data: any, fileName: string) {
    const blob = new Blob([data], {type: 'application/pdf'});
    saveAs(blob, fileName);
  }
}
