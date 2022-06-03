import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@shared';
import { AclsWhitelistComponent } from './acls-whitelist.component';

describe('AclsWhitelistComponent', () => {
  let component: AclsWhitelistComponent;
  let fixture: ComponentFixture<AclsWhitelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [AclsWhitelistComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AclsWhitelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
