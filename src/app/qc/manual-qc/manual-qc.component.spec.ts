import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualQcComponent } from './manual-qc.component';

describe('ManualQcComponent', () => {
  let component: ManualQcComponent;
  let fixture: ComponentFixture<ManualQcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualQcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
