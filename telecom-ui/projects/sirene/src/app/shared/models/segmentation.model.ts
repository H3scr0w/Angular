import { PopItem } from './popitem.model';

export class Segmentation {
  constructor(
    public id: number = 0,
    public name: string = '',
    public paloZoneName: string = '',
    public comments: string = '',
    public popItems: PopItem[] = [],
    public isDeleted: boolean = false
  ) {}
}

export class SegmentationFilter extends Segmentation {
  constructor() {
    super();
  }
}
