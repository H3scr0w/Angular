import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@shared';
import { IncapsulaAclsComponent } from './incapsula-acls.component';

describe('IncapsulaAclsComponent', () => {
  let component: IncapsulaAclsComponent;
  let fixture: ComponentFixture<IncapsulaAclsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [IncapsulaAclsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapsulaAclsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
