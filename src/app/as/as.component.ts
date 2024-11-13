import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { As, Dt, Project, Qc, SelectedVariables, Variable } from '../main/entities';
import { CommonsService } from '../main/commons.service';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { VarDialogComponent } from '../qc/var-dialog/var-dialog.component';
import { RegexAsDialogComponent } from '../as/regex-as-dialog/regex-as-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-as',
  templateUrl: './as.component.html',
  styleUrls: ['./as.component.css'],
})
export class AsComponent implements OnInit {
  project: Project;
  dt: Dt;
  qc: Qc;
  ass: As;
  displayedColumns = ['name', 'missing', 'type', 'outcome', 'predictor', 'confounders', 'covariates'];
  dataSource: MatTableDataSource<Variable>;
  variables: Variable[];
  selection: SelectionModel<Variable>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  readonly: boolean;
  params: { asOutputs: any; varTypes?: string[]; transformOptions?: string[]; };
  chartsData: any[];
  selected_variables_list: SelectedVariables = {outcome: [], predictor: [], confounder: [], covariate: []};
  isSaving: boolean;
  error: string;
  errorHttp: HttpErrorResponse;
  private states: { [x: string]: any; } = [];
  pageSize: number;
  showAdvance = false;
  private advancedSettings: any[] = [{ minTotSample: 50, sigmaMax: 2, dweight: 8 }, { minTotSample: 50, sigmaMax: 1, dweight: 4 }, { minTotSample: 50, sigmaMax: 2, dweight: 8 }];

  constructor(private commons: CommonsService, private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    this.pageSize = 500;
    this.params = this.commons.params;
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selection = new SelectionModel<Variable>(true, []);
    this._getAs();
  }

  changeAdvancedSetting(event: MatButtonToggleChange) {
    const tab = this.advancedSettings[event.value];
    this.ass = { ...this.ass, ...tab };
  }

  onChangeAdvanced(event: { srcElement: any; }) {
    const ele = event.srcElement;
    this.advancedSettings[2][ele.name] = ele.value;
  }

  private _getAs() {
    const id = this.route.snapshot.paramMap.get('id');
    this.commons.getAs(id).subscribe({
      next: this.handleAs.bind(this),
      error: this.handleError.bind(this),
    });
  }

  private handleAs(a: As) {
    this.project = this.commons.project;
    this.dt = this.commons.dt;
    this.qc = this.commons.qc;
    this.ass = a;
    this.setCustomeAdvancedValues(a);
    this.isSaving = false;
    this.error = '';
    this.readonly = a.result.length > 0 ? true : false;
    if (!this.readonly && !this.displayedColumns.includes('select')) {
      this.displayedColumns.unshift('select');
    }
    this.params.asOutputs.map((o: string | number) => (this.states[o] = false));
    this.commons.dataReady.next();
    this.commons.getVariables_AS(this.project, this.qc, this.ass).subscribe(v => {
      this.dataSource.data = this.variables = v;
      this._charts();
    });
  }

  private setCustomeAdvancedValues(a: As) {
    const custom = this.advancedSettings[this.advancedSettings.length - 1];
    custom.minTotSample = a.minTotSample;
    custom.sigmaMax = a.sigmaMax;
    custom.dweight = a.dweight;
  }

  private handleError(error: HttpErrorResponse) {
    this.errorHttp = error;
  }

  private _detectErrors() {
    let hasError = false;
    let hasOutcome = 0,
      hasPredictor = 0,
      hasCovariates = 0;
    this.variables.forEach((v: Variable) => {
      if (v.outcome) {
        hasOutcome++;
      }
      if (v.predictor) {
        hasPredictor++;
      }
      if (v.covariate) {
        hasCovariates++;
      }
    });
    hasError = !hasOutcome || !hasPredictor;
    if (hasError) {
      this.commons.snack('You have to choose at least one outcome and one predictor');
      return false;
    }
    if(this.ass.name == "") {
      this.commons.snack('You have to name your variables selection');
      return false;
    }
    return true;
  }

  private triggerResult() {
    this.commons.newResult(this.ass).subscribe(r => {
      this.commons.goResult(r); // don't wait for the end of the analysis to go to Result page.
    });
  }

  saveAndGo(as: As, changed: Variable[]) {
    if (this._detectErrors()) {
      this.isSaving = true;
      this.error = '';
      if (this.readonly) {
        this.triggerResult();
      } else {
        this.commons.updateCacheVariables(this.qc, this.ass, this.variables)
        this.commons.patchAs(as, changed).subscribe(
          () => {
            this.triggerResult();
            this.isSaving = false;
          },
          error => {
            this.error = error.error.detail;
            this.isSaving = false;
          }
        );
      }
    }
  }

  duplicate(as: As, variables: Variable[]) {
    this.isSaving = true;
    this.commons.duplicateAS(as, variables).subscribe(
    tmpNewAs => {
      var newAs = new As();
      newAs = tmpNewAs;
      newAs.name = as.name;
      newAs.testMusicalChair = as.testMusicalChair;
      newAs.testStandard = as.testStandard;
      newAs.preselection = as.preselection;
      newAs.logistic = as.logistic;
      newAs.imputation = as.imputation;
      this.commons.updateCacheVariables(this.qc, this.ass, this.variables)
      this.isSaving = false;
      this.commons.goAs(newAs);
      setTimeout(function () {
        location.reload();
      }, 200);
      },
    );
  };

  save(as: As, variables: Variable[]) {
    (this.isSaving = true), (this.error = '');
    this.commons.updateCacheVariables(this.qc, this.ass, this.variables)
    return this.commons.patchAs(as, variables).subscribe(() => {
      this.commons.snack(`AS and ${variables.length} variables saved.`);
      this.isSaving = false;
    });
  }

  applyFilter(q: string) {
    this.selection.clear();
    const regularExpression = new RegExp(q, "i");
    this.dataSource.data = this.variables.filter(v => v.name.match(regularExpression));
  }

  isAllSelected = () => this.selection.selected.length === this.dataSource.data.length;

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  openDialog(variable: Variable) {
    this.dialog.open(VarDialogComponent, {
      width: '80%',
      data: { variable, qc: this.qc, isPreQc: false, vars: this.dataSource['_renderData'].value },
    });
  }

  private _charts() {
    const d = new Map<string, number>();
    this.params.asOutputs.map((o: string) => (d.set(o,0)));
    this.selected_variables_list = {outcome: [], predictor: [], confounder: [], covariate: []};
    this.variables.forEach(v => {
      d.forEach((value, key) => {
        (v[key] ? d.set(key,d.get(key)+1) && this.selected_variables_list[key as keyof typeof this.selected_variables_list].push(v.name) : 0);
      })
    });
    const chartsData = [] as any[];
    d.forEach((value, key) => (chartsData.push({name :key, value : d.get(key)})))
    this.chartsData = chartsData;
  }

  private _confounderRule(v: Variable) {
    if (v.confounder) {
      v.covariate = false;
    }
  }

  change(v: Variable, attrName: string | number, event: any) {
    if (event) {
      v[attrName] = !v[attrName];
      this._confounderRule(v);
      this._charts();
      this._detectErrors();
    }
  }

  massSelect(output: string) {
    this.states[output] = !this.states[output];
    this.selection.selected.map(v => {
      v[output] = this.states[output];
      this._confounderRule(v);
    });
    this._charts();
    this._detectErrors();
  }

  clear_all() {
    for (let v in this.variables) {
      this.variables[v].outcome = false;
      this.variables[v].predictor = false;
      this.variables[v].confounder = false;
      this.variables[v].covariate = false;
    }
    this._charts();
  }

  pageEvent = (e: PageEvent) => (this.commons.pageSize = e.pageSize);

  openRegexDialog = () => this.dialog.open(RegexAsDialogComponent, { width: '80%' });

}
