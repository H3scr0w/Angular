import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CatalogOptions } from '../../models/catalog-options';

@Component({
  selector: 'stgo-catalog-options-add',
  templateUrl: './catalog-option-add.component.html',
  styleUrls: ['./catalog-option-add.component.css']
})
export class CatalogOptionsAddComponent implements OnInit {
  catalogOptionsAddForm = this.fb.group({
    optionName: [''],
    optionCode: [''],
    setupCost: ['0'],
    monthlyCost: ['0']
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CatalogOptionsAddComponent>,
    private translateService: TranslateService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {}

  addCatalogOptions(): void {
    if (this.catalogOptionsAddForm.valid) {
      const catalogOptions: CatalogOptions = Object.assign(this.catalogOptionsAddForm.value);
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        disableClose: true,
        data: this.translateService.instant('order.option.add.confirmation.message')
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close(catalogOptions);
        }
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }
}
