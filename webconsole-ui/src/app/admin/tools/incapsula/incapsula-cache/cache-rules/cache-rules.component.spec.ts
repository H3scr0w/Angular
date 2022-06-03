import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheRulesComponent } from './cache-rules.component';

describe('CacheRulesComponent', () => {
  let component: CacheRulesComponent;
  let fixture: ComponentFixture<CacheRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CacheRulesComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
