import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoricalDialogComponent } from './categorical-dialog.component';

describe('CategoricalDialogComponent', () => {
  let component: CategoricalDialogComponent;
  let fixture: ComponentFixture<CategoricalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoricalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoricalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
