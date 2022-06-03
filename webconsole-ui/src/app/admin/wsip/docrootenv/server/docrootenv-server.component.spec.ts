import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocrootEnvServerComponent } from './docrootenv-server.component';

describe('DocrootEnvServerComponent', () => {
  let component: DocrootEnvServerComponent;
  let fixture: ComponentFixture<DocrootEnvServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocrootEnvServerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocrootEnvServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
