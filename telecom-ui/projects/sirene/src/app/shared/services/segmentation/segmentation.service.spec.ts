import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Page } from '@shared';
import { Segmentation } from '../../models/segmentation.model';
import { SegmentationService } from './segmentation.service';

describe('SegmentationService', () => {
  let segmentationService: SegmentationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SegmentationService]
    });
  });

  beforeEach(() => {
    segmentationService = TestBed.inject(SegmentationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([SegmentationService], (service: SegmentationService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a Segmentation paginated', async(() => {
    // fake response
    const expectedResponse: Page<Segmentation> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Segmentation>;
    segmentationService
      .getAllSegmentation('', 0, 10, '', '', null)
      .subscribe((result: Page<Segmentation>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/segmentations?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
