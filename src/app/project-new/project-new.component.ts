import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonsService } from '../main/commons.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-project-new',
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.css'],
})
export class ProjectNewComponent {
  newProjectForm: FormGroup;
  fileToUpload: File = null;
  error: string;
  percentage: number;
  disabled: boolean = true;

  constructor(private fb: FormBuilder, private commons: CommonsService, private router: Router) {
    //const now = new Date();
    //const defaultName = 'Project ' + now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + ' by ' + this.commons.user.name;
    this.newProjectForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
      //name: [defaultName],
      //description: [this.commons.user.name + ' created this project ' + now],
      file: [],
    });
  }

  onSubmit() {
    this.error = null;
    this.percentage = 0;
    const formData = new FormData();
    formData.append('name', this.newProjectForm.value.name);
    formData.append('description', this.newProjectForm.value.description);
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.commons
      .newProject(formData).subscribe({
        next: event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.percentage = Math.round((100 * event.loaded) / event.total);
          }
          if (event.type === HttpEventType.Response) {
            console.log(typeof(event.body))
            if (typeof(event.body) != "number") {
              this.error = event.body;
              this.percentage = 0;
            }
            if (!this.error) {
              this.router.navigate(['/p/'+event.body])
            }
          }
        },
        error: err => {
          this.percentage = 0;
          this.error = err;
          return err;
        }
      });
  }


  onFileSelected(event: any): void {
    this.fileToUpload = event.target.files[0] ?? null;
    if (!["text/csv", "text/plain", "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel.sheet.macroEnabled.12",
    "application/vnd.ms-excel.sheet.binary.macroEnabled.12"].includes(this.fileToUpload.type)) {
      this.error = "Only .txt, .csv, .xls, .xlsx, .xlsb are supported"
    }
    else {
      this.error = null;
    }
    this.onChange();
  }

  onChange() {
    if (this.fileToUpload) {
      if (["text/csv", "text/plain", "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
      "application/vnd.ms-excel.sheet.binary.macroEnabled.12"].includes(this.fileToUpload.type) 
      && this.newProjectForm.value.description != '' 
      && this.newProjectForm.value.name != ''){
        this.disabled = false;
      }
      else {
        this.disabled = true;
      }
    }
  }
}
