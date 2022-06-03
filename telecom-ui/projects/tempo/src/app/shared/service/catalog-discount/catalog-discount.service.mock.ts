import { of, Observable } from 'rxjs';
import { CatalogDiscount } from '../../models/catalog-discount';
import { ICatalogDiscountService } from './catalog-discount.service';

export class MockCatalogDiscountService implements ICatalogDiscountService {
  getCatalogDiscount(catalogId: number): Observable<CatalogDiscount> {
    return of(null);
  }
}
