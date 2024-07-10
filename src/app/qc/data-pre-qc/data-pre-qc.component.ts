import { Component, Input } from '@angular/core';
import { Project, Qc, Variable } from 'src/app/main/entities';

@Component({
  selector: 'app-data-pre-qc',
  templateUrl: './data-pre-qc.component.html',
  styleUrls: ['./data-pre-qc.component.css']
})
export class DataPreQcComponent {
  @Input() project: Project;
  @Input() qc: Qc;
  @Input() set variables(vars: Variable[]) {
    this.results = [...this.qc.dataSummaryPreQc];
  }
  results: any[];
}
