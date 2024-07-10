import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonsService } from '../main/commons.service';
import { As,Dt,Project, Qc, Result } from '../main/entities';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  project: Project;
  dt: Dt;
  qc: Qc;
  ass: As;
  result: Result;
  version: any = require('../../../package.json').version;

  constructor(private location: Location, private commons: CommonsService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.commons.dataReady.subscribe(() => setTimeout(() => this._build(this.location.path()), 0));
  }

  private _build(path: string) {
    if (path.startsWith('/p/')) {
      this.project = this.commons.project;
    }
    if (path.startsWith('/dt/')) {
      this.project = this.commons.project;
      this.dt = this.commons.dt;
    }
    if (path.startsWith('/qc/')) {
      this.project = this.commons.project;
      this.dt = this.commons.dt;
      this.qc = this.commons.qc;
    }
    if (path.startsWith('/as/')) {
      this.project = this.commons.project;
      this.dt = this.commons.dt;
      this.qc = this.commons.qc;
      this.ass = this.commons.ass;
    }
    if (path.startsWith('/r/')) {
      this.project = this.commons.project;
      this.dt = this.commons.dt;
      this.qc = this.commons.qc;
      this.ass = this.commons.ass;
      this.result = this.commons.result;
    }
    if (this.result && this.ass && this.result.asId !== this.ass.ident) {
      this.result = null;
    }    
    if (this.result && this.qc && this.result.qcId !== this.qc.ident) {
      this.result = null;
    }
    if (this.ass && this.qc && this.ass.qcId !== this.qc.ident) {
      this.ass = null;
    }
    if (this.qc && this.project && this.qc.projectId !== this.project.ident) {
      this.qc = null;
    }
  }

  newProject = () => this.commons.goNewProject();

  logout = () => this.commons.logout();
}
