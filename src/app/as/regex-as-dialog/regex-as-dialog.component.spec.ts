import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegexAsDialogComponent } from './regex-as-dialog.component';

describe('RegexAsDialogComponent', () => {
  let component: RegexAsDialogComponent;
  let fixture: ComponentFixture<RegexAsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegexAsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegexAsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
