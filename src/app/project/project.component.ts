import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonsService } from '../main/commons.service';
import { Project, Variable } from '../main/entities';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VarDetailComponent } from './var-detail/var-detail.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  project: Project;
  creator: boolean = false;
  displayedColumns = ['name', 'missing', 'type'];
  dataSource: MatTableDataSource<Variable>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  variables: Variable[];
  pageSize: number;

  constructor(private commons: CommonsService, private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.pageSize = this.commons.pageSize;
    this.commons.getProject(Number(id)).subscribe(p => {
      this.project = p;
      this.commons.getVariablesForProjectDetail(this.project).subscribe(v => {
        this.variables = v;
        this.dataSource.data = this.variables;
      });
      this.commons.isCreator(Number(id)).subscribe(isCreator => {
        this.creator = isCreator;
      })
    });

  }

  applyFilter(q: string) {
    const regularExpression = new RegExp(q, "i"); //incessitive case search
    this.dataSource.data = this.variables.filter(v => v.name.match(regularExpression));
  }

  openDialog = (v: any) =>
  this.dialog.open(VarDetailComponent, {
    width: '80%',
    data: { variable: v, project : this.project ,vars: this.dataSource['_renderData'].value },
  });
}
