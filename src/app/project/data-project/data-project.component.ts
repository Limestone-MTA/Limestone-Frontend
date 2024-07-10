import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../main/entities';

@Component({
  selector: 'app-data-project',
  templateUrl: './data-project.component.html',
  styleUrls: ['./data-project.component.css'],
})
export class DataProjectComponent implements OnInit {
  @Input() project: Project;

  constructor() {}

  ngOnInit() {
  }
}
