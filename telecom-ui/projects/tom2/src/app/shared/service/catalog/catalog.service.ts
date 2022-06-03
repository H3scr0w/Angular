import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Catalog } from '../../models/catalog';
import { CatalogInfoItems } from '../../models/catalog-info-items';
import { CatalogOptions } from '../../models/catalog-options';
import { ImportExcelError } from '../../models/import-excel-error';
import { Page } from '../../models/page.model';
import { CatalogVersion, CatalogVersionFilter } from './../../models/catalog-version';

export interface ICatalogService {
  getAllCatalogs(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<Catalog>>;

  getAllCatalogVersions(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    catalogVersionFilter?: CatalogVersionFilter
  ): Observable<Page<CatalogVersion>>;

  downloadCatalogVersion(id: number): Observable<Blob>;

  getCatalog(id: number): Observable<Catalog>;

  getCatalogInformationItems(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    catalogVersion?: string
  ): Observable<Page<CatalogInfoItems>>;

  getCatalogOptions(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    catalogVersion?: string
  ): Observable<Page<CatalogOptions>>;

  addCatalog(catalog: Catalog): Observable<Catalog>;

  editCatalog(catalog: Catalog): Observable<Catalog>;

  downloadTemplate(): Observable<Blob>;

  validateAndUpload(fileToUpload: File): Observable<ImportExcelError[]>;

  changeCatalogVersionStatus(versionId: number): Observable<CatalogVersion>;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService implements ICatalogService {
  private url = '/catalogs';
  constructor(private http: HttpClient) {}

  getAllCatalogs(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    catalogFilter?: Catalog
  ): Observable<Page<Catalog>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (catalogFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (catalogFilter.name) {
        params = params.set('name', '' + catalogFilter.name.trim());
      }
      if (catalogFilter.contract != null && catalogFilter.contract.id) {
        params = params.set('contractId', '' + catalogFilter.contract.id);
      }
      if (catalogFilter.contract != null && catalogFilter.contract.operator) {
        params = params.set('operatorId', '' + catalogFilter.contract.operator);
      }
    }

    return this.http.get<Page<Catalog>>(this.url, { params });
  }

  getAllCatalogVersions(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    catalogVersionFilter?: CatalogVersionFilter
  ): Observable<Page<CatalogVersion>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (catalogVersionFilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (catalogVersionFilter.sgnet) {
        params = params.set('sgnet', catalogVersionFilter.sgnet);
      }
      if (catalogVersionFilter.status || catalogVersionFilter.status === false) {
        params = params.set('status', '' + catalogVersionFilter.status);
      }
      if (catalogVersionFilter.catalog != null && catalogVersionFilter.catalog.id) {
        params = params.set('catalogId', '' + catalogVersionFilter.catalog.id);
      }
      if (catalogVersionFilter.operator != null && catalogVersionFilter.operator.id) {
        params = params.set('operatorId', '' + catalogVersionFilter.operator.id);
      }
    }

    return this.http.get<Page<CatalogVersion>>(this.url + '/versions', { params });
  }

  getCatalogInformationItems(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    catalogVersion?: string
  ): Observable<Page<CatalogInfoItems>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (catalogVersion) {
      params = params.set('isAdvanceFilter', '' + 'true');
      params = params.set('catalogVersion', catalogVersion);
    }

    return this.http.get<Page<CatalogInfoItems>>(this.url + '/info-items', { params });
  }

  getCatalogOptions(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    catalogVersion?: string
  ): Observable<Page<CatalogOptions>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (catalogVersion) {
      params = params.set('isAdvanceFilter', '' + 'true');
      params = params.set('catalogVersion', catalogVersion);
    }

    return this.http.get<Page<CatalogOptions>>(this.url + '/options', { params });
  }

  downloadCatalogVersion(id: number): Observable<Blob> {
    return this.http.get(this.url + '/versions/export/' + id, { responseType: 'blob' });
  }

  getCatalog(id: number): Observable<Catalog> {
    return this.http.get<Catalog>(this.url + '/' + id);
  }

  addCatalog(catalog: Catalog): Observable<Catalog> {
    return this.http.post<Catalog>(this.url, catalog);
  }

  editCatalog(catalog: Catalog): Observable<Catalog> {
    return this.http.put<Catalog>(this.url + '/' + catalog.id, catalog);
  }

  downloadTemplate(): Observable<Blob> {
    const url = window.location.origin + '/assets/CATALOG_TEMPLATE_FILE.xls';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/xls');
    return this.http.get(url, { headers, responseType: 'blob' });
  }

  validateAndUpload(fileToUpload: File): Observable<ImportExcelError[]> {
    const url = `${this.url}/services/upload`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<ImportExcelError[]>(url, formData);
  }

  changeCatalogVersionStatus(versionId: number): Observable<CatalogVersion> {
    return this.http.put<CatalogVersion>(this.url + '/' + 'versions' + '/' + 'activate' + '/' + versionId, versionId);
  }
}
