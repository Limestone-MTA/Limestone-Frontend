import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Dt, Project, Variable } from '../main/entities';
import { ActivatedRoute } from '@angular/router';
import { CommonsService } from '../main/commons.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { BinaryDialogComponent } from './binary-dialog/binary-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatRadioChange } from '@angular/material/radio';
import { VarDetailComponent } from '../project/var-detail/var-detail.component';
import { CategoricalDialogComponent } from './categorical-dialog/categorical-dialog.component';


@Component({
  selector: 'app-data-transformation',
  templateUrl: './data-transformation.component.html',
  styleUrls: ['./data-transformation.component.css']
})
export class DataTransformationComponent implements OnInit {
  project: Project;
  dt: Dt;
  variables: Variable[][];
  isSaving: boolean;
  readonly: boolean;
  error: string;
  changed = new Set<Variable>();

  binaryDataSource: MatTableDataSource<Variable>;
  ordinalDataSource: MatTableDataSource<Variable>;
  continuousDataSource: MatTableDataSource<Variable>;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort, { static: false }) sortContinuous: MatSort;

  displayedColumnsText = ['name', 'actions'];
  displayedColumnsContinuous = ['name', 'Nothing', 'Logarithmic', 'Normalization'];
  pageSizeBinary: number;
  pageSizeOrdinal: number;
  pageSizeContinuous: number;

  emptyBinary: boolean = true;
  emptyOrdinal: boolean = true;
  emptyContinuous: boolean = true;

  ordinalTransformationApplied: boolean = false;

  selection: SelectionModel<Variable>;
  params: { asOutputs: any; varTypes?: string[]; transformOptions?: string[]; };
  selectedTransformation: string;

  constructor(private commons: CommonsService, private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.pageSizeBinary = 20;
    this.pageSizeOrdinal = 20;
    this.pageSizeContinuous = 500;
    this.binaryDataSource = new MatTableDataSource([]);
    this.ordinalDataSource = new MatTableDataSource([]);
    this.continuousDataSource = new MatTableDataSource([]);

    this.params = this.commons.params;
    this.selection = new SelectionModel<Variable>(true, []);

    this.commons.getDt(id).subscribe(d => {
      this.project = this.commons.project;
      this.dt = d;
      this.readonly = d.qualityControl.length ? true : false;
      this.commons.dataReady.next();
      this.commons.getVariablesForDataTransformation(this.dt, this.project).subscribe(v => {
        this.manageVariables(v);
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.binaryDataSource.paginator = this.paginator.toArray()[0];
      this.ordinalDataSource.paginator = this.paginator.toArray()[1];
      this.continuousDataSource.paginator = this.paginator.toArray()[2];
      this.continuousDataSource.sort = this.sortContinuous;
    });
  }

  manageVariables = (variables: Variable[][]) => {
    if (!this.readonly && !this.displayedColumnsContinuous.includes('select')) {
      this.displayedColumnsContinuous.unshift('select');
    }
    this.binaryDataSource.data = variables[0];
    this.ordinalDataSource.data = variables[1];
    this.continuousDataSource.data = variables[2];
    this.variables = variables;
    this.emptyBinary = variables[0].length == 0;
    this.emptyOrdinal = variables[1].length == 0;
    this.emptyContinuous = variables[2].length == 0;
  }

  binaryTransform = (v : Variable) => this.dialog.open(BinaryDialogComponent, {
    width: '50%',
    data: { variable: v, project : this.project, readonly: this.readonly, changed: this.changed},
  });

  transformCategorical = (v : Variable) => this.dialog.open(CategoricalDialogComponent, {
    width: '50%',
    data: {dt : this.dt, variable: v, readonly: this.readonly, changed: this.changed},
  });

  cancelTransformation = (variable : Variable) => {
    this.changed.delete(variable);
    variable.transform = "Nothing";
  }

  change(v: Variable, transformation: string, event: any) {
    if (event) {
      v.transform = transformation;
    }
    if (event.value != "Nothing") {
      this.changed.add(v);
    }
    if (event.value == "Nothing") {
      this.changed.delete(v);
    }
    
  }

  save = () => {
    if (this._detectErrors()) {
      (this.isSaving = true), (this.error = '');
      this.commons.transformData(this.dt, this.changed).subscribe(
        () => {
          this.commons.snack(`Variables transformation saved.`);
          (this.isSaving = false);
        },
      );
    }
  };

  saveAndGo = () => {
    if (this._detectErrors()) {
      this.isSaving = true;
      this.error = '';
      if (this.readonly) {
        this.commons.newQc(this.dt, this.project).subscribe(this.commons.goQc);
      } else {
        this.commons.transformData(this.dt, this.changed).subscribe({
          next: (response) => {
            this.commons.newQc(this.dt, this.project).subscribe(this.commons.goQc);
            this.isSaving = false;
            },
          error: (e) => {
            this.error = e.error.detail;
            this.isSaving = false;
          }
        });
      }
    }
  };
  
  duplicate = () => {
    if (this._detectErrors()) {
      this.isSaving = true;
      this.error = '';
      // transform variables
      this.commons.duplicateDT(this.dt, this.changed).subscribe(
        tmpNewDt => {
          var newDt = new Dt();
          newDt = tmpNewDt;
          newDt.name = this.dt.name;
          this.commons.snack(`Variables transformed`);
          this.isSaving = false;
          this.commons.goDt(newDt);
          setTimeout(function () {
            location.reload();
          }, 200);
        },
      );
    };
  };

  private _detectErrors() {
    if(this.dt.name == "") {
      this.commons.snack('You have to name your data transformation');
      return false;
    }
    return true;
  }


  applyFilterBinary(q: string) {
    const regularExpression = new RegExp(q, "i"); //incessitive case search
    this.binaryDataSource.data = this.variables[0].filter(v => v.name.match(regularExpression));
  }

  applyFilterOrdinal(q: string) {
    const regularExpression = new RegExp(q, "i"); //incessitive case search
    this.ordinalDataSource.data = this.variables[1].filter(v => v.name.match(regularExpression));
  }

  applyFilterContinuous(q: string) {
    const regularExpression = new RegExp(q, "i"); //incessitive case search
    this.continuousDataSource.data = this.variables[2].filter(v => v.name.match(regularExpression));
  }

  pageEvent = (e: PageEvent) => (this.commons.pageSize = e.pageSize);

  applyFilter(q: string) {
    this.selection.clear();
    const regularExpression = new RegExp(q, "i");
    this.continuousDataSource.data = this.variables[2].filter(v => v.name.match(regularExpression));
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.continuousDataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected = () => this.selection.selected.length === this.continuousDataSource.data.length;

  transformationChange(event: MatRadioChange) {
    this.selection.selected.map(v => {
      v.transform = event.value;
      if (event.value != "Nothing") {
        this.changed.add(v);
      }
      if (event.value == "Nothing") {
        this.changed.delete(v);
      }
    });
    this.selectedTransformation = "";
    this._detectErrors();
  }

  openDialogBinary = (v: any) =>
  this.dialog.open(VarDetailComponent, {
    width: '80%',
    data: { variable: v, project : this.project ,vars: this.binaryDataSource['_renderData'].value },
  });
  
  openDialogOrdinal = (v: any) =>
  this.dialog.open(VarDetailComponent, {
    width: '80%',
    data: { variable: v, project : this.project ,vars: this.ordinalDataSource['_renderData'].value },
  });

  openDialogContinuous = (v: any) =>
  this.dialog.open(VarDetailComponent, {
    width: '80%',
    data: { variable: v, project : this.project ,vars: this.continuousDataSource['_renderData'].value },
  });

}