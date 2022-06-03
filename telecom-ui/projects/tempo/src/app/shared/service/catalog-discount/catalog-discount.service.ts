import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CatalogDiscount } from '../../models/catalog-discount';

export interface ICatalogDiscountService {
  getCatalogDiscount(catalogId: number): Observable<CatalogDiscount>;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogDiscountService implements ICatalogDiscountService {
  private _url = '/discounts/catalogs/';

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    if (!value) {
      this._url = '/discounts/catalogs/';
    } else {
      this._url = value;
    }
  }

  constructor(private http: HttpClient) {}

  getCatalogDiscount(catalogId: number): Observable<CatalogDiscount> {
    return this.http.get<CatalogDiscount>(this.url + catalogId);
  }
}
