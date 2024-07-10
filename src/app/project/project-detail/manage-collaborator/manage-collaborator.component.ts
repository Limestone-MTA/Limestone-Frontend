import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonsService } from '../../../main/commons.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'manage-add-collaborator',
  templateUrl: './manage-collaborator.component.html',
  styleUrls: ['./manage-collaborator.component.css']
})
export class ManageCollaboratorComponent {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  projectId: number;
  newCollaboratorForm: FormGroup;
  error: string;
  done: boolean;
  dataSource: MatTableDataSource<string>;
  displayedColumns = ['mail', 'remove'];


  constructor(private fb: FormBuilder, private commons: CommonsService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.projectId = data.projectId;
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.newCollaboratorForm = this.fb.group({
      mail: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.commons.getCollaborator(this.projectId).subscribe(data => {
      this.dataSource.data = data;
    })
  }

  onSubmit() {
    const mail = this.newCollaboratorForm.value.mail;
    this.commons.addCollaborator(this.projectId, mail)
      .subscribe(returned => {
        if (returned != "OK") {
          this.error = returned;
          this.done = false;
        }
        else {
          this.error = null;
          this.done = true;
          this.ngOnInit();
        }
      });
  }

  Remove(mail: string) {
    this.commons.removeCollaborator(this.projectId, mail)
      .subscribe(returned => {
        if (returned != "OK") {
          this.error = returned;
          this.done = false;
        }
        else {
          this.error = null;
          this.done = true;
          this.ngOnInit();
        }
      });
  }
}
