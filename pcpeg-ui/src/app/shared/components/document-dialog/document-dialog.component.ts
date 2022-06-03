import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DocumentFileModel } from '../../models/document-file.model';
import { DocumentTypes } from '../../models/document-types';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { DocumentModel } from './../../models/document.model';

@Component({
  selector: 'stgo-document-dialog',
  templateUrl: './document-dialog.component.html',
  styleUrls: ['./document-dialog.component.css']
})
export class DocumentDialogComponent implements OnInit, OnDestroy {
  @ViewChild(FileUploadComponent)
  fileUploadComponent: FileUploadComponent;
  documentFile: DocumentFileModel;

  isLoading = false;
  disabledUpload = true;
  fileToUpload: File;
  documentForm: FormGroup;
  types = [
    { label: 'Accord', value: DocumentTypes.Accord },
    { label: 'Avenant', value: DocumentTypes.Avenant }
  ];

  private sub$: Subscription = new Subscription();

  constructor(public dialogRef: MatDialogRef<DocumentDialogComponent>) {
    this.documentForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null),
      type: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onFileChange(files: File[]): void {
    if (files && files.length > 0) {
      this.fileToUpload = files[0];
      this.disabledUpload = false;
    } else {
      this.disabledUpload = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    const document: DocumentModel = new DocumentModel();
    document.startDate = this.documentForm.controls.startDate.value;
    document.endDate = this.documentForm.controls.endDate.value;
    document.documentType = this.documentForm.controls.type.value;
    document.documentName = this.fileToUpload.name;
    this.documentFile = new DocumentFileModel(document, this.fileToUpload);
    this.fileUploadComponent.clearFiles();
    this.disabledUpload = true;
    this.dialogRef.close(this.documentFile);
  }
}
