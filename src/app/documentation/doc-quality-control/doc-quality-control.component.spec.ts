import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocQualityControlComponent } from './doc-quality-control.component';

describe('DocQualityControlComponent', () => {
  let component: DocQualityControlComponent;
  let fixture: ComponentFixture<DocQualityControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocQualityControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocQualityControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
