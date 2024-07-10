import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonsService } from '../../main/commons.service';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { As, Dt, Qc, Result } from 'src/app/main/entities';
import { DeleteWarningComponent } from './delete-warning/delete-warning.component';
import { ManageCollaboratorComponent } from './manage-collaborator/manage-collaborator.component';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent {
  @Input() project: any;
  @Input() projects: any;
  actionsEnable = true;
  hide_delete_button: boolean = true;
  SimplifiedQCError: string;

  constructor(private commons: CommonsService, public dialog: MatDialog) {}

  ngOnChanges() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '60%',
      data: { project: this.project },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "OK"){ //disable action if user chose a QC
        this.actionsEnable = false;
      }
      else if (result != undefined) {
        this.SimplifiedQCError = result.event.error.detail;
        this.commons.snack("Couldn't perform simplified QC. Please check the quality control manually.");
      }
    });
  }

  detail(p: { ident: any; }) {
    this.commons.goProject(p);
  }

  deleteModeChange(): void{
    this.hide_delete_button = !this.hide_delete_button;
  }

  deleteDt(dt: Dt): void{
    this.commons.deleteDt(dt.projectId, dt.ident).subscribe( result => {
      this.commons.getProject(this.project.ident).subscribe( p => {
        this.project = p;
      });
    });
  }

  deleteQc(qc: Qc): void{
    this.commons.deleteQc(qc.projectId, qc.dtId, qc.ident).subscribe( result => {
      this.commons.getProject(this.project.ident).subscribe( p => {
        this.project = p;
      });
    });
  }

  deleteAs(as: As): void{
    this.commons.deleteAs(as.projectId, as.dtId, as.qcId, as.ident).subscribe( result => {
      this.commons.getProject(this.project.ident).subscribe( p => {
        this.project = p;
      });
    });
  }

  deleteResult(result: Result): void{
    this.commons.deleteResult(result.projectId, result.dtId, result.qcId, result.asId, result.ident).subscribe( result => {
      this.commons.getProject(this.project.ident).subscribe( p => {
        this.project = p;
      });
    });
  }

  deleteProject(id: number): void{
    const dialogRef = this.dialog.open(DeleteWarningComponent, {
      width: '60%',
      data: { projectId: id },
    });
  }

  manageCollaborator(id: number): void{
    const dialogRef = this.dialog.open(ManageCollaboratorComponent, {
      width: '60%',
      data: { projectId: id },
    });
  }
  
  
}
