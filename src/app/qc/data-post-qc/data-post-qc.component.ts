import { Input, Component } from '@angular/core';
import { Project, Qc, Variable } from '../../main/entities';

@Component({
  selector: 'app-data-post-qc',
  templateUrl: './data-post-qc.component.html',
  styleUrls: ['./data-post-qc.component.css'],
})
export class DataPostQcComponent {
  @Input() project: Project;
  @Input() qc: Qc;
  @Input() set variables(vars: Variable[]) {
    this.results = [...this.qc.dataSummaryPostQc];
  }
  results: any[];
}
