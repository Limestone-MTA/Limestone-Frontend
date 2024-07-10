import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonsService } from '../../main/commons.service';

@Component({
  selector: 'app-regex-as-dialog',
  templateUrl: './regex-as-dialog.component.html',
  styleUrls: ['./regex-as-dialog.component.css']
})
export class RegexAsDialogComponent {
  constructor(private commons: CommonsService,
    public dialogRef: MatDialogRef<RegexAsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
