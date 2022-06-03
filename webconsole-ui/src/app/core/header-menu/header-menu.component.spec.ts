import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared';
import { WebsiteService } from '../../shared/services/website.service';
import { websiteReducer } from '../webconsole/website.reducer';
import { HeaderMenuComponent } from './header-menu.component';

describe('HeaderMenuComponent', () => {
  let component: HeaderMenuComponent;
  let fixture: ComponentFixture<HeaderMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        SharedModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({
          website: websiteReducer
        })
      ],
      declarations: [HeaderMenuComponent],
      providers: [WebsiteService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
