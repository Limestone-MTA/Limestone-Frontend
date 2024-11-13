import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { As, Project, Qc, Result, Summary, Analyse, Progress } from '../main/entities';
import { CommonsService } from '../main/commons.service';
import { HttpClient } from '@angular/common/http';
import { interval, switchMap, Subscription, catchError, of } from 'rxjs';


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
  private timeout: string | number | NodeJS.Timeout;
  progressPercentage: number = -1;
  estimatedTime: number = -1;
  estimatedEndTimeHour: number;
  estimatedEndTimeMin: number;
  endTommorow: boolean = false;
  tooLong: boolean = false;
  constructor(private commons: CommonsService, private http: HttpClient, private route: ActivatedRoute, public dialog: MatDialog, private cd: ChangeDetectorRef) {}

  async ngOnInit() {
    this.resultId = this.route.snapshot.paramMap.get('id');
    this.getProgressOneTime(this.resultId);
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
        break;
      case 1:
        break;
    }
    this.getProgress(this.resultId);
  }

  getProgress(resultId: string) {
    const pollingSubscription: Subscription = interval(30000)  // Poll every 60,000 milliseconds (1 minute)
      .pipe(
        switchMap(() => 
          this.http.get<Progress>(this.commons.api_url + 'progress/' + resultId, {withCredentials: true}).pipe(
            catchError(error => {
              pollingSubscription.unsubscribe();
              return of({ progressPercentage: this.progressPercentage , estimatedTime: this.estimatedTime}); // Return the last known progress to keep polling
            })
          )
        )
      )
      .subscribe({
        next: response => {
          if (response && response.progressPercentage !== undefined && response.estimatedTime !== undefined) {
            this.progressPercentage = Number(response.progressPercentage.toFixed(2));
            this.estimatedTime = Number(response.estimatedTime.toFixed(0));
            const date = new Date();
            this.estimatedEndTimeHour = Math.floor((date.getHours()*60+date.getMinutes()+this.estimatedTime)/60);
            this.estimatedEndTimeMin = (date.getHours()*60+date.getMinutes()+this.estimatedTime)%60;
            if(this.estimatedEndTimeHour >= 24) {
              this.estimatedEndTimeHour = this.estimatedEndTimeHour%24;
              this.endTommorow = true;
            }
            if(this.estimatedTime > 1440) {
              this.tooLong = true;
            }
            // Stop polling if progress reaches 100
            if (this.progressPercentage >= 100) {
              pollingSubscription.unsubscribe();
              this.handleResult();
            }
          }
          else {
            console.error('Unexpected response structure:', response); // Log unexpected structure
          }
        },
        error: err => {
          pollingSubscription.unsubscribe();
        }
      });
  }

  getProgressOneTime(resultId: string) {
    this.http.get<Progress>(this.commons.api_url + 'progress/' + resultId, {withCredentials: true}).subscribe({
      next: response => {
        if (response && response.progressPercentage !== undefined && response.estimatedTime !== undefined) {
          this.progressPercentage = Number(response.progressPercentage.toFixed(2));
          this.estimatedTime = Number(response.estimatedTime.toFixed(0));
          const date = new Date();
          this.estimatedEndTimeHour = Math.floor((date.getHours()*60+date.getMinutes()+this.estimatedTime)/60);
          this.estimatedEndTimeMin = (date.getHours()*60+date.getMinutes()+this.estimatedTime)%60;
          if(this.estimatedEndTimeHour >= 24) {
            this.estimatedEndTimeHour = this.estimatedEndTimeHour%24;
            this.endTommorow = true;
          }
          if(this.estimatedTime > 1440) {
            this.tooLong = true;
          }
          if (this.progressPercentage >= 100) {
            this.handleResult();
          }
        }
      },
      error: err => {
      }

    })
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
