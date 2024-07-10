import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonsService } from '../main/commons.service';

@Component({
  selector: 'app-reset-token-expired',
  templateUrl: './reset-token-expired.component.html',
  styleUrls: ['./reset-token-expired.component.css']
})
export class ResetTokenExpiredComponent {
  error: string;
  message: string;
  
  mail = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  forgotPasswordForm: FormGroup = this.builder.group({
    mail: this.mail,
  });
  constructor(private builder: FormBuilder, private commons: CommonsService) {}
  

  onSubmit() {
    if(true) {
      this.commons.forgotPassword(this.forgotPasswordForm.value.mail).subscribe(
        result => {
          this.message = "Reset password e-mail sent to your address";
          this.error = null;
        },
        error => {
          if (typeof(error.error.detail) === "string") {
            this.error = error.error.detail;
            this.message = null;
          }
          else {
            this.error = error.error.detail[0].msg;
            this.message = null;
          }
        },
      );
    }
  }

  getErrorMessageMail() {
    if (this.mail.hasError('required')) {
      return 'You must enter a mail';
    }
    return this.mail.hasError('email') ? 'Not a valid email' : '';
  }

}
