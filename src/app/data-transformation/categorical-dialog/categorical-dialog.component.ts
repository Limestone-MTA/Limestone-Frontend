import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonsService } from 'src/app/main/commons.service';
import { Dt, Variable } from 'src/app/main/entities';


@Component({
  selector: 'app-categorical-dialog',
  templateUrl: './categorical-dialog.component.html',
  styleUrls: ['./categorical-dialog.component.css']
})
export class CategoricalDialogComponent {
  dt: Dt;
  variable: Variable;
  readonly: boolean;
  changed = new Set<Variable>();
  list_categories: string[];
  selected_reference: string;
  constructor(private commons: CommonsService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dt = data.dt;
    this.variable = data.variable;
    this.readonly = data.readonly;
    this.changed = data.changed;
  }

  ngOnInit() {
    this.commons.getVariableValueForCategoricalTransformation(this.dt, this.variable).subscribe(
      (e: any) => {
        this.list_categories = e;
        this.selected_reference = this.list_categories[0];
      },
    );
  }
  
  change(v: Variable["dataDistribution"], transformation: string, event: any) {
    if (event) {
      v.occurrence = transformation;
    }
  }

  applyChanges() {
    this.variable.transform = "Ordinal";
    this.variable.dataDistribution = [{"value" : this.selected_reference, "occurence": "reference"}];
    this.changed.add(this.variable);
  }
}