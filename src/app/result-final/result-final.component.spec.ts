import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultFinalComponent } from './result-final.component';

describe('ResultFinalComponent', () => {
  let component: ResultFinalComponent;
  let fixture: ComponentFixture<ResultFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
