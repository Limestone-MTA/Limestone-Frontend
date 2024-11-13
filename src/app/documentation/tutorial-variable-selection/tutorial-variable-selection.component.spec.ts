import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialVariableSelectionComponent } from './tutorial-variable-selection.component';

describe('TutorialVariableSelectionComponent', () => {
  let component: TutorialVariableSelectionComponent;
  let fixture: ComponentFixture<TutorialVariableSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialVariableSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialVariableSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
