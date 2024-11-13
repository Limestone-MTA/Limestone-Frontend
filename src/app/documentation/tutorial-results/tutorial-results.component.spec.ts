import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialResultsComponent } from './tutorial-results.component';

describe('TutorialResultsComponent', () => {
  let component: TutorialResultsComponent;
  let fixture: ComponentFixture<TutorialResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
