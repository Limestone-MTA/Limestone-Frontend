import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPostQcComponent } from './data-post-qc.component';

describe('DataPostQcComponent', () => {
  let component: DataPostQcComponent;
  let fixture: ComponentFixture<DataPostQcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPostQcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataPostQcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
