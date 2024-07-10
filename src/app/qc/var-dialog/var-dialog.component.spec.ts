import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarDialogComponent } from './var-dialog.component';

describe('VarDialogComponent', () => {
  let component: VarDialogComponent;
  let fixture: ComponentFixture<VarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
