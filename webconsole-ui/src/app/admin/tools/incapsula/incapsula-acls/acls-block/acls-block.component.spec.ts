import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@shared';
import { AclsBlockComponent } from './acls-block.component';

describe('AclsBlockComponent', () => {
  let component: AclsBlockComponent;
  let fixture: ComponentFixture<AclsBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [AclsBlockComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AclsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
