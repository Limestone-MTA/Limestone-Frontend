import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowCountRuleComponent } from './low-count-rule.component';

describe('LowCountRuleComponent', () => {
  let component: LowCountRuleComponent;
  let fixture: ComponentFixture<LowCountRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LowCountRuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LowCountRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
