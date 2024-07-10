import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VarDialogComponent } from '../var-dialog/var-dialog.component';
import { RegexQcDialogComponent } from '../regex-qc-dialog/regex-qc-dialog.component';
import * as _ from 'lodash';
import { CommonsService } from '../../main/commons.service';
import { Qc, Variable } from '../../main/entities';

@Component({
  selector: 'app-manual-qc',
  templateUrl: './manual-qc.component.html',
  styleUrls: ['./manual-qc.component.css'],
})
export class ManualQcComponent implements OnInit {
  @Input() qc: Qc;
  @Input() readonly: boolean;
  displayedColumns = ['name', 'missing', 'type', 'excluded'];
  dataSource: MatTableDataSource<Variable>;
  params: { varTypes: string[]; asOutputs: string[]; transformOptions: string[]; };
  @Input() variables: Variable[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() calculate = new EventEmitter<any>();
  pageSize: number;

  constructor(private commons: CommonsService, public dialog: MatDialog) {}

  ngOnInit() {
    this.pageSize = 500;
    this.params = this.commons.params;
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.variables;
    this.variables = this.variables.sort((a, b) => a.rank - b.rank)
  }

  applyFilter(q: string) {
    const regularExpression = new RegExp(q, "i"); //incessitive case search
    this.dataSource.data = this.variables.filter(v => v.name.match(regularExpression));
  }

  openRegexDialog = () => this.dialog.open(RegexQcDialogComponent, { width: '80%' });

  openDialog = (v: any) =>
    this.dialog.open(VarDialogComponent, {
      width: '80%',
      data: { variable: v, qc: this.qc, isPreQc: true, vars: this.dataSource['_renderData'].value },
    });

  pageEvent = (e: PageEvent) => (this.commons.pageSize = e.pageSize);
}
