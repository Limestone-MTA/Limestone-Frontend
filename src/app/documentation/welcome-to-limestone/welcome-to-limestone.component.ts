import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome-to-limestone',
  templateUrl: './welcome-to-limestone.component.html',
  styleUrls: ['./welcome-to-limestone.component.css']
})
export class WelcomeToLimestoneComponent {

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}
