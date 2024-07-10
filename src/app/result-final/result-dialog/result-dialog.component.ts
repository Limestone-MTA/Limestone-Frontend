import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonsService } from '../../main/commons.service';
import { Association } from '../../main/entities';

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.css'],
})
export class ResultDialogComponent implements OnInit {
  displayedColumns = ['name', 'varExplained', 'beta', 'sd', 'pval'];
  dataSource: MatTableDataSource<Association>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  d: any;
  error: string;
  private associations: any[][];
  dataCharts: any[];
  private q: string;
  private test = 0; // classic = 0 or musical chair = 1
  customColors: [{ name: string; value: string }];
  // options for pie chart
  view: [number, number] = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  constructor(private commons: CommonsService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.d = data;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.d.logistic) {
      this.displayedColumns = ['name','oddsRatio', 'beta', 'sd', 'pval'];
    }
    this.commons.getAssociationDetail(this.d.assoc, this.d.result, this.d.preselection, this.d.logistic).subscribe(
      (e: any) => {
        this.associations = e;
        this.render();
      },
    );
  }

  applyFilter(q: string) {
    this.q = q;
    this.render();
  }

  toggle(row: any) {
    row.view = !row.view;
    this.render();
  }

  private render() {
    this.dataSource.data = this.associations[this.test].filter(v => v.name.match(this.q));
    var i;
    var tmp;
    var sum = 0;
    this.dataCharts = []
    for (i of this.dataSource.data) {
      tmp = {"name": i["name"], "value": i["varExplained"]}
      this.dataCharts.push(tmp)
      sum += i["varExplained"];
    }
    tmp = {"name": "unexplained", "value": (1 - sum)}
    this.dataCharts.push(tmp)
    //this.dataCharts = this.associations[this.test].filter(v => v.name.match(this.q)).filter(v => v.view);
  }

  changeTest(event: MatButtonToggleChange) {
    this.test = parseInt(event.value, 10);
    this.render();
  }
}
