import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarDetailComponent } from './var-detail.component';

describe('VarDetailComponent', () => {
  let component: VarDetailComponent;
  let fixture: ComponentFixture<VarDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
