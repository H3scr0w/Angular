import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

/**
 * The Mat Pagination I18N
 */
@Injectable()
export class StgoMatPaginatorIntl extends MatPaginatorIntl {
  /**
   * Instantiate the object
   *
   * @param translate the translate service
   */
  constructor(private translate: TranslateService) {
    super();
    this.translate.onLangChange.subscribe((e: Event) => {
      this.getAndInitTranslations();
    });
    this.getAndInitTranslations();
  }

  /**
   * Initialize the translation label
   */
  getAndInitTranslations(): void {
    this.itemsPerPageLabel = this.translate.instant('ITEMS_PER_PAGE');
    this.nextPageLabel = this.translate.instant('NEXT_PAGE');
    this.previousPageLabel = this.translate.instant('PREVIOUS_PAGE');
    this.changes.next();
  }

  /**
   * Change label of range
   *
   * @param page page number
   * @param pageSize page size
   * @param length page length
   */
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  }
}
