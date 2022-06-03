import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'stgo-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input()
  multiple: boolean;
  @Input()
  disabled: boolean;
  @Input()
  accept: string;
  @Output()
  fileSelected = new EventEmitter<File[]>();

  @ViewChild('fileUpload', { static: true })
  fileUpload: ElementRef;

  files: File[] = [];

  constructor() {}

  onClick(): void {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.click();
    }
  }

  onFileSelected(files: File[]): void {
    if (!files) {
      return;
    }
    for (const file of files) {
      if (this.validate(file)) {
        if (!this.isMultiple()) {
          this.files = [];
        }
        this.files.push(file);
      }
    }
    this.fileSelected.emit(this.files);
  }

  removeFile(file: File): void {
    const ix: number = this.files.indexOf(file);
    if (this.files && -1 !== ix) {
      this.files.splice(ix, 1);
      this.clearInputElement();
      this.fileSelected.emit(this.files);
    }
  }

  clearFiles(): void {
    this.files = [];
    this.clearInputElement();
    this.fileSelected.emit(this.files);
  }

  validate(file: File): boolean {
    for (const f of this.files) {
      if (f.name === file.name && f.lastModified === file.lastModified && f.size === f.size && f.type === f.type) {
        return false;
      }
    }
    return true;
  }

  clearInputElement(): void {
    this.fileUpload.nativeElement.value = '';
  }

  isMultiple(): boolean {
    return this.multiple;
  }
}
