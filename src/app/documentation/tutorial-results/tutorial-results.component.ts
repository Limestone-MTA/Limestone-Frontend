import { Component } from '@angular/core';

@Component({
  selector: 'app-tutorial-results',
  templateUrl: './tutorial-results.component.html',
  styleUrls: ['./tutorial-results.component.css']
})
export class TutorialResultsComponent {

  ngOnInit() {
    window.scrollTo(0, 0);
  }
  
}
