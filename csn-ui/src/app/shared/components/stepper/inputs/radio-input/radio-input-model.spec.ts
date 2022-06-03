import {RadioInputModel} from './radio-input-model';

describe('RadioInputModel', () => {
  it('should create an instance', () => {
    expect(new RadioInputModel('labelKey', 'labelId',
      'ctrlValue', 'imageName')).toBeTruthy();
  });
});
