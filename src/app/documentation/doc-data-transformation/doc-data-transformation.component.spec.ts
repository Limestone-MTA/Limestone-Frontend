import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocDataTransformationComponent } from './doc-data-transformation.component';

describe('DocDataTransformationComponent', () => {
  let component: DocDataTransformationComponent;
  let fixture: ComponentFixture<DocDataTransformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocDataTransformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocDataTransformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
