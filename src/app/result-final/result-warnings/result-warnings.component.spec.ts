import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultWarningsComponent } from './result-warnings.component';

describe('ResultWarningsComponent', () => {
  let component: ResultWarningsComponent;
  let fixture: ComponentFixture<ResultWarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultWarningsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultWarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
