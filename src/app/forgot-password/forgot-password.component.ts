import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonsService } from '../main/commons.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  message: string;
  disabled: boolean = false;
  mail = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  forgotPasswordForm: FormGroup = this.builder.group({
    mail: this.mail,
  });
  constructor(private builder: FormBuilder, private commons: CommonsService) {}

  onSubmit() {
    if (this.getErrorMessageMail() == "") {
      this.disabled = true;
      this.message = null;
      this.commons.forgotPassword(this.forgotPasswordForm.value.mail).subscribe(
        result => {
          this.message = "Reset password e-mail sent to your address";
          this.disabled = false;
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
