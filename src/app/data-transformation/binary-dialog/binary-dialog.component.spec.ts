import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinaryDialogComponent } from './binary-dialog.component';

describe('BinaryDialogComponent', () => {
  let component: BinaryDialogComponent;
  let fixture: ComponentFixture<BinaryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinaryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BinaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
