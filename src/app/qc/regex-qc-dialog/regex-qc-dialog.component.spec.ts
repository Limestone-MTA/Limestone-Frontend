import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegexQcDialogComponent } from './regex-qc-dialog.component';

describe('RegexCqDialogComponent', () => {
  let component: RegexQcDialogComponent;
  let fixture: ComponentFixture<RegexQcDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegexQcDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegexQcDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
