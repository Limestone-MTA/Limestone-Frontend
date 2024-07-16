import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ResultDialogComponent } from './result-dialog/result-dialog.component';
import { ResultWarningsComponent } from './result-warnings/result-warnings.component';
import { Summary, Analyse, ResultElement, Result, Project, Dt, Qc, As } from '../main/entities';
import { CommonsService } from '../main/commons.service';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-result-final',
  templateUrl: './result-final.component.html',
  styleUrls: ['./result-final.component.css'],
})
export class ResultFinalComponent implements OnInit {
  @Input()
  distrib: any;
  @Input()
  analyse: Analyse;
  @Input()
  result: Result;
  @Input()
  preselection: boolean;
  @Input()
  logistic: boolean;
  project: Project;
  dt: Dt;
  qc: Qc;
  ass: As;
  summary: Summary;
  displayedColumns = ['view', 'out', 'pred', 'MAbeta', 'MAp', 'MCbeta', 'MCp'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  chartsData: [];
  snack = this.commons.snack;
  showDetails = true;
  pageSize: number;
  renderData: BehaviorSubject<ResultElement[]>;
  response: any;
  hideGraphic: boolean = true;
  warningsLevel = 0;
  noResults : boolean = false;

  constructor(private commons: CommonsService, public dialog: MatDialog, private cd: ChangeDetectorRef, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.project = this.commons.project;
    this.dt = this.commons.dt;
    this.qc = this.commons.qc;
    this.ass = this.commons.ass;
    this.pageSize = 500;
    this.dataSource = new MatTableDataSource(this.analyse.result);
    this.renderData = (this.dataSource as any)._renderData; // not cool :(
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.summary = this.commons.buildResultSummary(this.analyse.result);
    this.renderData.subscribe(value => {
      this.chartsData = this.commons.buildChartsData(value);
    });
    this.checkWarningsLevel();
    if(this.analyse.result.length == 0) {
      this.noResults = true;
    }
  }

  applyFilter(q: string) {
    const regularExpression = new RegExp(q, "i"); //incessitive case search
    this.dataSource.data = this.analyse.result.filter(v => v.out.match(regularExpression) || v.pred.match(regularExpression));
    this.chartsData = this.commons.buildChartsData(this.dataSource.data);
  }


  zoom(q: string) {
    this.snack(`Zoom on "${q}". Unzoom by removing the filter above the table`);
    q = this.commons.escapeRegExp(q);
    this.applyFilter(q);
    return q;
  }

  sortData(sort: Sort) {}

  openDialog(a: any) {
    this.dialog.open(ResultDialogComponent, {
      width: '80%',
      height: '100%',
      data: { assoc: a, vars: this.renderData.value, result: this.result, preselection: this.preselection, logistic: this.logistic},
    });
  }

  openWarnings() {
    this.dialog.open(ResultWarningsComponent, {
      width: '80%',
      height: '100%',
      data: {analyse : this.analyse},
    });
  }

  pageEvent(e: PageEvent) {
    this.commons.pageSize = e.pageSize;
  }

  onSelect(e: ResultElement) {
    const p = this.renderData.value[Number(e.name)];
    this.openDialog(p);
  }

  changeDisplay() {
    this.hideGraphic = !this.hideGraphic;
  }

  download() {
    this.commons.resultDownload(this.result.ident).subscribe(response => {
      this.response = response;
      const blob = new Blob([this.response.body], { type: 'text' });
      const url= window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "result_" + this.result.created + ".txt";
      a.click();
    })
  }

  checkWarningsLevel() {
    for(const warning_index in this.analyse.warnings) {
      if(this.analyse.warnings[warning_index].level > this.warningsLevel) {
        this.warningsLevel = this.analyse.warnings[warning_index].level;
      }
    }
  }
}
