import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutliersRuleComponent } from './outliers-rule.component';

describe('OutliersRuleComponent', () => {
  let component: OutliersRuleComponent;
  let fixture: ComponentFixture<OutliersRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutliersRuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutliersRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
