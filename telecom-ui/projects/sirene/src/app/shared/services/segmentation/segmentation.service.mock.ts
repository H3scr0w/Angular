import { Page } from '@shared';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { PopItem } from '../../models/popitem.model';
import { Segmentation } from '../../models/segmentation.model';
import { ISegmentationService } from './segmentation.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class SegmentationServiceMock implements ISegmentationService {
  addSegmentation(sector: Segmentation): Observable<Segmentation> {
    throw new Error('Method not implemented.');
  }

  editSegmentation(sector: Segmentation): Observable<Segmentation> {
    throw new Error('Method not implemented.');
  }

  deleteSegmentation(id: number): Observable<void> {
    throw new Error('Method not implemented.');
  }

  getPopItems(): Observable<PopItem[]> {
    throw new Error('Method not implemented.');
  }

  getPopItemsBySegmentId(id: number): Observable<PopItem[]> {
    throw new Error('Method not implemented.');
  }

  getAllSegmentation(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: Sort.Asc | Sort.Desc | ''
  ): Observable<Page<Segmentation>> {
    return of(null);
  }
}
