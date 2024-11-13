import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeToLimestoneComponent } from './welcome-to-limestone.component';

describe('WelcomeToLimestoneComponent', () => {
  let component: WelcomeToLimestoneComponent;
  let fixture: ComponentFixture<WelcomeToLimestoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeToLimestoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeToLimestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
