import { Component, OnInit } from '@angular/core';
import { Project } from '../main/entities';
import { CommonsService } from '../main/commons.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[];
  panelOpenState = false;

  constructor(private commons: CommonsService) {}

  ngOnInit() {
    this.commons.getProjects().subscribe(p => {this.projects = p});
  }

  newProject() {
    this.commons.goNewProject();
  }

  refresh() {
    this.commons.getProjects().subscribe(p => (this.projects = p));
  }
}
