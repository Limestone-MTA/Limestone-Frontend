import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dt, Project, Qc, Variable } from '../main/entities';
import { CommonsService } from '../main/commons.service';

@Component({
  selector: 'app-qc',
  templateUrl: './qc.component.html',
  styleUrls: ['./qc.component.css'],
})
export class QcComponent implements OnInit {
  project: Project;
  dt: Dt;
  qc: Qc;
  variables: Variable[];
  params: { varTypes: string[]; asOutputs: string[]; transformOptions: string[]; };
  isSaving: boolean;
  readonly: boolean;
  error: string;
  disableMissingRule: boolean;

  constructor(private commons: CommonsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.params = this.commons.params;
    const id = this.route.snapshot.paramMap.get('id');
    this.commons.getQc(id).subscribe(q => {
      this.project = this.commons.project;
      this.dt = this.commons.dt;
      this.qc = q;
      this.qc.outliersChoose="setDistance";
      if (this.qc.distanceMean < 0) {this.qc.outliersChoose="preserveAll"};
      this.readonly = q.analysisSetting.length ? true : false;
      this.commons.dataReady.next();
      this.commons.getVariablesForQc(this.qc, this.project).subscribe(v => {
        this.calculate(v);
        this.maxMissingZero();
      });
    });
  }

  // called when QC ready or when rules changed (missing data and low count)
  calculate(vars: Variable[]) {
    //change transform when you select a data transformation so the user can see it
    if (this.qc.lowCountRule < 1) {
      this.qc.lowCountRule = 1;
    }
    if (this.qc.missingThreshold < 0) {
      this.qc.missingThreshold = 0;
    }
    this.variables = this.commons.applyRules(vars, this.qc);
  }

  save = (qc: Qc) => {
    if (this._detectErrors()) {
      (this.isSaving = true), (this.error = '');
      this.commons.patchQc(qc).subscribe(
        () => {
          this.commons.snack(`Qc saved.`);
          (this.isSaving = false);
        },
      );
    }
  };

  saveAndGo = (qc: Qc, readonly: boolean) => {
    if (this._detectErrors()) {
      this.isSaving = true;
      this.error = '';
      if (readonly) {
        this.commons.newAs(qc).subscribe(this.commons.goAs);
      } else {
        this.commons.patchQc(qc).subscribe(
          response => {
          this.commons.newAs(qc).subscribe(this.commons.goAs);
          this.isSaving = false;
          },
          error => {
            this.error = error.error.detail;
            this.isSaving = false;
          }
        );
      }
    }
  };

  duplicate = (qc: Qc) => {
    this.isSaving = true;
    // save current QC
    this.commons.patchQc(qc).subscribe(
      () => {
        // create a new QC
        this.commons.newQc(this.dt, this.project).subscribe(
          tmpNewQc => {
            var newQc = new Qc();
            newQc = tmpNewQc;
            newQc.name = qc.name;
            newQc.lowCountRule = qc.lowCountRule;
            newQc.outliersChoose = qc.outliersChoose;
            newQc.distanceMean = qc.distanceMean;
            newQc.missingThreshold = qc.missingThreshold;
            // change new QC to match the old one
            this.commons.patchQc(newQc).subscribe(
              () => {
                this.commons.snack(`Global parameters duplicated`);
                this.isSaving = false;
                this.commons.goQc(newQc);
                setTimeout(function () {
                  location.reload();
                }, 200);
              },
            );
          },
        );
      },
    );
  };

  maxMissingZero() {
    let max = 0;
    this.variables.forEach((v) => {
      if (max<v.missing){
        max = v.missing
      }
    })
    if (max == 0){
      this.disableMissingRule = true
    }
    else {
      this.disableMissingRule = false
    }
  }

  private _detectErrors() {
    if(this.qc.name == "") {
      this.commons.snack('You have to name your quality control');
      return false;
    }
    return true;
  }
}