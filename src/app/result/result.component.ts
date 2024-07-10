import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { As, Project, Qc, Result, Summary, Analyse } from '../main/entities';
import { CommonsService } from '../main/commons.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit, OnDestroy {
  project: Project;
  qc: Qc;
  ass: As;
  result: Result;
  distrib: any;
  analyse: Analyse;
  data: any;
  summary: Summary;
  error: HttpErrorResponse;
  private INTERVAL = 3000;
  private resultId: string;
  dataProcessingLabel = 'Data processing';
  private timeout: string | number | NodeJS.Timeout;

  constructor(private commons: CommonsService, private route: ActivatedRoute, public dialog: MatDialog, private cd: ChangeDetectorRef) {}

  async ngOnInit() {
    this.resultId = this.route.snapshot.paramMap.get('id');
    this.getResultFromServer();
  }

  private getResultFromServer() {
    this.commons.getResult(this.resultId).subscribe({
      next: this.initializeData.bind(this),
      error: this.handleError.bind(this),
    });
  }
  
  private initializeData(r: Result) {   
    this.result = r; 
    this.commons.getProject(r.projectId).subscribe((response:Project) => {
      this.project = response;
      this.commons.getQc(r.qcId.toString()).subscribe((response:Qc) => {
        this.qc = response;
        this.commons.getAs(r.asId.toString()).subscribe((response:As) => {
          this.ass = response
          this.newResultFromServer(r);
        }) 
      });
    });
  }

  private newResultFromServer(r: Result) {
    switch (r.status) {
      case 0:
        this.commons.launchAnalyse(r, this.ass.preselection, this.ass.logistic).subscribe();
        this.reload();
        break;
      case 10:
      case 20:
        this.reload();
        break;
      case 30:
        this.reload();
        break;
      case 40:
      case 50:
        this.handleResult();
        break;
    }
  }

  // TODO retrieve just the Result and not the whole Project
  private reload() {
    this.timeout = setTimeout(this.getResultFromServer.bind(this), this.INTERVAL++);
  }

  private handleResult() {
    this.commons.getResultFile(this.result).subscribe({
      next: this.handleResultFile.bind(this),
      error: this.handleError.bind(this),
    });
  }

  private handleResultFile(analyse: Analyse) {
    if (analyse.completed) {
      this.commons.getVarDistribution(this.project, this.qc, this.ass).subscribe(d => (this.distrib = d));
      this.error = analyse.error;
    } else if (analyse.error && analyse.error.length > 3) {
      this.error = analyse.error;
    } else {
      this.timeout = setTimeout(this.handleResult.bind(this), this.INTERVAL++);
    }
    this.analyse = analyse;
    this.dataProcessingLabel = `Data processing (${this.analyse.progress.percentage}%)`;
  }

  private handleError(error: HttpErrorResponse) {
    this.error = error;
    this.commons.snack('An error occurred!');
    throw error;
  }

  ngOnDestroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
