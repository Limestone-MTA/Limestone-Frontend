import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonsService } from 'src/app/main/commons.service';
import { Project, Variable } from 'src/app/main/entities';

@Component({
  selector: 'app-var-detail',
  templateUrl: './var-detail.component.html',
  styleUrls: ['./var-detail.component.css']
})
export class VarDetailComponent {
  variable: Variable;
  variables: Variable[];
  p: Project;
  isPreQc: boolean;
  // histogram options
  histData: any[];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Value';
  showYAxisLabel = true;
  yAxisLabel = 'Occurrence';
  noHistogram = false;

  constructor(private commons: CommonsService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.variable = data.variable;
    this.p = data.project
    this.variables = data.vars;
    this.commons.buildHistogrammDataProjectDetail(this.p.ident, this.variable.ident).subscribe(
      (data : any[]) => 
      {
        this.histData = data;
        if(this.histData.length == 0) {
          this.noHistogram = true;
        }
      }
    );
  }

  private getIndex = (vars: any[], v: Variable) => vars.reduce((a, b, i) => (b.ident === this.variable.ident ? (a = i) : a), 0);

  move = (direction: any) => {
    (this.variable = this.variables[this.getIndex(this.variables, this.variable) + direction]);
    this.histData = null;
    this.noHistogram = false;
    this.commons.buildHistogrammDataProjectDetail(this.p.ident, this.variable.ident).subscribe(
      (data : any[]) => 
      {
        this.histData = data;
        if(this.histData.length == 0) {
          this.noHistogram = true;
        }
      }
    );
  };

  isForcedExclude = (v: Variable) => this.commons.isForcedExclude(v);
}