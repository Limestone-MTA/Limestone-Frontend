import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPreQcComponent } from './data-pre-qc.component';

describe('DataPreQcComponent', () => {
  let component: DataPreQcComponent;
  let fixture: ComponentFixture<DataPreQcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPreQcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataPreQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
