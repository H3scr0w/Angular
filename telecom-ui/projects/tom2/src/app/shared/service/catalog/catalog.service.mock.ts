import { of, Observable } from 'rxjs';
import { Catalog } from '../../models/catalog';
import { CatalogInfoItems } from '../../models/catalog-info-items';
import { CatalogOptions } from '../../models/catalog-options';
import { CatalogVersion, CatalogVersionFilter } from '../../models/catalog-version';
import { ImportExcelError } from '../../models/import-excel-error';
import { Page } from '../../models/page.model';
import { ICatalogService } from './catalog.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockCatalogService implements ICatalogService {
  getAllCatalogs(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<Catalog>> {
    return of(null);
  }

  getAllCatalogVersions(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    catalogVersionFilter?: CatalogVersionFilter
  ): Observable<Page<CatalogVersion>> {
    return of(null);
  }

  downloadCatalogVersion(id: number): Observable<Blob> {
    throw new Error('Method not implemented.');
  }

  getCatalog(id: number): Observable<Catalog> {
    return of(null);
  }

  getCatalogInformationItems(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    catalogVersion?: string
  ): Observable<Page<CatalogInfoItems>> {
    return of(null);
  }

  getCatalogOptions(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    catalogVersion?: string
  ): Observable<Page<CatalogOptions>> {
    return of(null);
  }

  addCatalog(catalog: Catalog): Observable<Catalog> {
    throw new Error('Method not implemented.');
  }
  editCatalog(catalog: Catalog): Observable<Catalog> {
    throw new Error('Method not implemented.');
  }

  downloadTemplate(): Observable<Blob> {
    throw new Error('Method not implemented.');
  }
  validateAndUpload(fileToUpload: File): Observable<ImportExcelError[]> {
    throw new Error('Method not implemented.');
  }

  changeCatalogVersionStatus(versionId: number): Observable<CatalogVersion> {
    return of(null);
  }
}
