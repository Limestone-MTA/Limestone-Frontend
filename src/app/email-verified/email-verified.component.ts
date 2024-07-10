import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonsService } from '../main/commons.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-verified',
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.css']
})
export class EmailVerifiedComponent implements OnInit{
  registerForm: FormGroup;
  error_token: string;
  token: string;
  message: string;
  error_mail: string;
  

  constructor(private fb: FormBuilder, private commons: CommonsService, private route: ActivatedRoute) {
    this.registerForm = this.fb.group({
      mail: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    })
    this.commons.mailVerify(this.token).subscribe(
      user => { this.error_token = null;
      },
      error => {
        if (typeof(error.error.detail) === "string") {
          this.error_token = error.error.detail;
        }
        else {
          this.error_token = error.error.detail[0].msg;
        }
      },
    );
  }

  onSubmit() {
    if (this.registerForm.value.mail == "") {
      this.error_mail = "Mail required";
    }
    else {
      this.commons.requestVerify(this.registerForm.value.mail).subscribe(
        result => {
          this.message = "Reset password e-mail sent to your address";
          this.error_mail = null;
        },
      );
    }
  }
}
