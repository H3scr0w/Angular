import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Page } from '@shared';
import { Observable } from 'rxjs';
import { PopItem } from '../../models/popitem.model';
import { Segmentation, SegmentationFilter } from '../../models/segmentation.model';

export interface ISegmentationService {
  getAllSegmentation(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: SegmentationFilter
  ): Observable<Page<Segmentation>>;

  addSegmentation(sector: Segmentation): Observable<Segmentation>;

  editSegmentation(sector: Segmentation): Observable<Segmentation>;

  deleteSegmentation(id: number): Observable<void>;

  getPopItems(): Observable<PopItem[]>;

  getPopItemsBySegmentId(id: number): Observable<PopItem[]>;
}

@Injectable({
  providedIn: 'root'
})
export class SegmentationService implements ISegmentationService {
  private url = '/segmentations';

  constructor(private http: HttpClient) {}

  getAllSegmentation(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    advancefilter?: SegmentationFilter
  ): Observable<Page<Segmentation>> {
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    if (advancefilter) {
      params = params.set('isAdvanceFilter', '' + 'true');
      if (advancefilter.id) {
        params = params.set('id', '' + advancefilter.id);
      }
      if (advancefilter.name) {
        params = params.set('name', '' + advancefilter.name);
      }
    }

    return this.http.get<Page<Segmentation>>(this.url, { params });
  }

  addSegmentation(segmentation: Segmentation): Observable<Segmentation> {
    return this.http.post<Segmentation>(this.url, segmentation);
  }

  editSegmentation(segmentation: Segmentation): Observable<Segmentation> {
    return this.http.put<Segmentation>(this.url + '/' + segmentation.id, segmentation);
  }

  deleteSegmentation(id: number): Observable<void> {
    return this.http.delete<void>(this.url + '/' + id);
  }

  getPopItems(): Observable<PopItem[]> {
    return this.http.get<PopItem[]>(this.url + '/pop-items');
  }

  getPopItemsBySegmentId(id: number): Observable<PopItem[]> {
    return this.http.get<PopItem[]>(this.url + '/' + id + '/pop-items');
  }
}
