import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetTokenExpiredComponent } from './reset-token-expired.component';

describe('ResetTokenExpiredComponent', () => {
  let component: ResetTokenExpiredComponent;
  let fixture: ComponentFixture<ResetTokenExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetTokenExpiredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetTokenExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
