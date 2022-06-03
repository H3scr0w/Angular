import { Component, Directive, HostListener, Injectable, Input, NgModule } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Directive({
  selector: '[routerLink]',
})
export class RouterLinkStubDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

@Component({selector: 'router-outlet', template: '<p>stub</p>'})
export class RouterOutletStubComponent {
}

@Injectable()
export class RouterStub {
  private _testEvent: {};

  // RouterStub.events is Observable
  private subjectEvent = new BehaviorSubject(this.testEvent);
  events = this.subjectEvent.asObservable();

  // Test event
  get testEvent() { return this._testEvent; }
  set testEvent(testEvent: {}) {
    this._testEvent = testEvent;
    this.subjectEvent.next(testEvent);
  }

  public url = '/mock';
  navigate(commands: any[], extras?: NavigationExtras) {}
}


@Injectable()
export class ActivatedRouteStub {
  private _testUrl: any[] = ['/mock'];

  // Test url
  get testUrl() { return this._testUrl; }
  set testUrl(url: any[]) {
    this._testUrl = url;
    this.subjectUrl.next(url);
  }

  // ActivatedRoute.url is Observable
  private subjectUrl = new BehaviorSubject(this.testUrl);
  url = this.subjectUrl.asObservable();

  // ActivatedRoute.params is Observable
  private subject = new BehaviorSubject(this.testParams);
  params = this.subject.asObservable();

  // ActivatedRoute.data is Observable
  private subjectData = new BehaviorSubject(this.testData);
  data = this.subjectData.asObservable();

  // Test parameters
  private _testParams: {};
  get testParams() { return this._testParams; }
  set testParams(params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }

  // Test data
  private _testData: {};
  get testData() { return this._testData; }
  set testData(data: {}) {
    this._testData = data;
    this.subjectData.next(data);
  }

  // ActivatedRoute.snapshot.params
  // ActivatedRoute.snapshot.data
  get snapshot() { return {params: this.testParams, data: this.testData}; }
}

@NgModule({
  declarations: [
    RouterLinkStubDirective,
    RouterOutletStubComponent,
  ],
  providers: [
    {provide: ActivatedRoute, useClass: ActivatedRouteStub},
    {provide: Router, useClass: RouterStub},
  ],
  exports: [
    RouterLinkStubDirective,
    RouterOutletStubComponent,
  ]
})
export class RouterStubsModule {
}
