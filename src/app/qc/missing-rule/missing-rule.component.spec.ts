import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingRuleComponent } from './missing-rule.component';

describe('MissingRuleComponent', () => {
  let component: MissingRuleComponent;
  let fixture: ComponentFixture<MissingRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissingRuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
