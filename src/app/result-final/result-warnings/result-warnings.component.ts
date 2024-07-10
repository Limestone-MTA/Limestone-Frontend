import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-result-warnings',
  templateUrl: './result-warnings.component.html',
  styleUrls: ['./result-warnings.component.css']
})
export class ResultWarningsComponent {

  warnings: any[];
  @ViewChild('paginatorWarnings', {static: true}) paginatorWarnings: MatPaginator;
  dataSourceWarnings: MatTableDataSource<any>;
  pageSizeWarnings: number;
  displayedColumnsWarnings = ['out', 'pred'];
  nbWarnings: number;

  @ViewChild('paginatorErrors', {static: true}) paginatorErrors: MatPaginator;
  dataSourceErrors: MatTableDataSource<any>;
  pageSizeErrors: number;
  displayedColumnsErrors = ['out', 'pred', 'message'];
  nbErrors: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.warnings = data.analyse.warnings;
  }

  ngOnInit() {
    this.createMatTableDataSources();
    this.dataSourceWarnings.paginator = this.paginatorWarnings;
    this.dataSourceErrors.paginator = this.paginatorErrors;
  }


  createMatTableDataSources() {
    var list_warnings: any[] = [];
    var list_errors: any[] = [];
    for (var warning_index in this.warnings) {
      if (this.warnings[warning_index].level == 1) {
        list_warnings.push(this.warnings[warning_index]);
      }
      else if (this.warnings[warning_index].level == 2) {
        list_errors.push(this.warnings[warning_index]);
      }
    }

    if(this.warnings.length == 0) {
      list_errors.push({level:2, out:"All analysis", pred:"", message:"An unknown problem occurred during the analysis. No results available. If this problem persists please contact us."})
    }
    this.nbWarnings= list_warnings.length;
    this.dataSourceWarnings = new MatTableDataSource(list_warnings);
    this.pageSizeWarnings = 5;

    this.nbErrors= list_errors.length;
    this.dataSourceErrors = new MatTableDataSource(list_errors);
    this.pageSizeErrors = 5;

  }

  pageEventErrors(e: PageEvent) {
    this.pageSizeErrors = e.pageSize;
  }

  pageEventWarnings(e: PageEvent) {
    this.pageSizeWarnings = e.pageSize;
  }

  applyFilter(q: string) {
    var list_warnings: any[] = [];
    var list_errors: any[] = [];
    for (var warning_index in this.warnings) {
      if (this.warnings[warning_index].level == 1) {
        list_warnings.push(this.warnings[warning_index]);
      }
      else if (this.warnings[warning_index].level == 2) {
        list_errors.push(this.warnings[warning_index]);
      }
    }
    const regularExpression = new RegExp(q, "i"); //incessitive case search
    this.dataSourceErrors.data = list_errors.filter(v => v.out.match(regularExpression) || v.pred.match(regularExpression) || v.message.match(regularExpression));
    this.dataSourceWarnings.data = list_warnings.filter(v => v.out.match(regularExpression) || v.pred.match(regularExpression));
  }

}
