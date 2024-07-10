import { Component, Inject, Input } from '@angular/core';
import { CommonsService } from '../../../main/commons.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-warning',
  templateUrl: './delete-warning.component.html',
  styleUrls: ['./delete-warning.component.css']
})
export class DeleteWarningComponent {
  projectId: number;

  constructor(private commons: CommonsService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.projectId = data.projectId;
  }
  
  deleteProject(): void{
    this.commons.deleteProject(this.projectId);
    setTimeout(function () {
      location.reload();
    }, 100);
    this.commons.goFrontpage();
  }
}
