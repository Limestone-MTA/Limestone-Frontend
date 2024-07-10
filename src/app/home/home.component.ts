import { Component } from '@angular/core';
import { CommonsService } from '../main/commons.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private commons: CommonsService) {}
  
  newProject() {
    this.commons.goNewProject();
  }
}
