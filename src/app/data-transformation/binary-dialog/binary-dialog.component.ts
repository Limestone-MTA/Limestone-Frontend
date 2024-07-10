import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonsService } from 'src/app/main/commons.service';
import { Variable } from 'src/app/main/entities';

@Component({
  selector: 'app-binary-dialog',
  templateUrl: './binary-dialog.component.html',
  styleUrls: ['./binary-dialog.component.css']
})
export class BinaryDialogComponent {
  variable: Variable;
  readonly: boolean;
  changed = new Set<Variable>();
  DataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = ['value', 'value 0', 'value 1'];

  constructor(private commons: CommonsService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.variable = data.variable;
    this.readonly = data.readonly;
    this.changed = data.changed;
  }

  ngOnInit() {
    //we use the dataDistribution to pass which value will be coded as 0 or 1, the coding is written in place of occurrence
    //it's weird but it means we don't have to create more parameters to the Variable entity
    this.DataSource = new MatTableDataSource([]);
    this.DataSource.sort = this.sort;
    this.DataSource.data = this.variable.dataDistribution;
  }

  change(v: Variable["dataDistribution"], transformation: string, event: any) {
    if (event) {
      v.occurrence = transformation;
    }
  }

  applyChanges() {
    this.variable.transform = "Binary"
    this.changed.add(this.variable);
  }
}