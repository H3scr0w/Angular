import { SafeHtmlPipe } from './safe-html.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { async, TestBed } from '@angular/core/testing';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('SafeHtmlPipe', () => {
  let domSanatizer: SpyObj<DomSanitizer>;

  beforeEach(async(() => {
    domSanatizer = createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

    TestBed.configureTestingModule({
      declarations: [SafeHtmlPipe],
      providers: [
        SafeHtmlPipe,
        {provide: DomSanitizer, useValue: domSanatizer},
      ],
    });
  }));

  it('create an instance', () => {
    const pipe = TestBed.inject(SafeHtmlPipe);
    expect(pipe).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
