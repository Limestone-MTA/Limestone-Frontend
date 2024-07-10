import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Variable, Qc } from '../../main/entities';
import { CommonsService } from '../../main/commons.service';

@Component({
  selector: 'app-var-dialog',
  templateUrl: './var-dialog.component.html',
  styleUrls: ['./var-dialog.component.css'],
})
export class VarDialogComponent {
  variable: Variable;
  variables: Variable[];
  qc: Qc;
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
    this.qc = data.qc;
    this.variables = data.vars;
    this.isPreQc = data.isPreQc;
    this.commons.buildHistogrammData(this.qc.ident, this.variable.ident, this.isPreQc).subscribe(
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
    this.commons.buildHistogrammData(this.qc.ident, this.variable.ident, this.isPreQc).subscribe(
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
