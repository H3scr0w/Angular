import { ListWrapper } from './list-wrapper.model';
import { SetWrapper } from './set-wrapper.model';

export class Fields<T> {
  set: SetWrapper<T>;
  list: ListWrapper<T>[];
}
