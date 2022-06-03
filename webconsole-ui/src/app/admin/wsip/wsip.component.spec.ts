import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared';
import { WebsiteComponent } from '../../website/website.component';
import { CmsComponent } from './cms/cms.component';
import { DocrootComponent } from './docroot/docroot.component';
import { DocrootcoreComponent } from './docrootcore/docrootcore.component';
import { DocrootenvComponent } from './docrootenv/docrootenv.component';
import { WebsiteEnvironmentComponent } from './hosting/website-environment/website-environment.component';
import { ServerComponent } from './server/server.component';
import { WsipRoutingModule } from './wsip-routing.module';
import { WsipComponent } from './wsip.component';

describe('WsipComponent', () => {
  let component: WsipComponent;
  let fixture: ComponentFixture<WsipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, BrowserAnimationsModule, CommonModule, WsipRoutingModule, HttpClientTestingModule],
      declarations: [
        WsipComponent,
        CmsComponent,
        DocrootComponent,
        DocrootcoreComponent,
        WebsiteComponent,
        DocrootenvComponent,
        ServerComponent,
        WebsiteEnvironmentComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WsipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
