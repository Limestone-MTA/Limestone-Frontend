import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonsService } from '../../../main/commons.service';
import { Project } from '../../../main/entities';

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.css'],
})
export class ProjectDialogComponent {
  project: Project;
  QCError: string;
  disabled: boolean;

  constructor(public dialogRef: MatDialogRef<ProjectDialogComponent>,private commons: CommonsService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.project = data.project;
  }

  advanced(p: Project) {
    this.disabled = true;
    this.commons.newDt(p).subscribe(dt => this.commons.goDt(dt));
  }

  simplified(p: Project) {
    this.disabled = true;
    this.commons.fastQcAs(p).subscribe(as => {
      this.commons.goAs(as);
      this.closeDialog("OK");
    },
    error => {
      this.closeDialog(error);
    });
  }

  closeDialog(message: string){
    this.dialogRef.close(message);
  }
}