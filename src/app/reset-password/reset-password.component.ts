import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonsService } from '../main/commons.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  regex_expression: string = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&-_£%"#$)(+=<>])[A-Za-z\d$@$!%*?&-_£%"#$)(+=<>].{8,}';
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(this.regex_expression) 
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(this.regex_expression) 
  ]);

  resetPasswordForm: FormGroup = this.builder.group({
    password: this.password,
    confirmPassword: this.confirmPassword,
  });

  error: string;
  message: string;
  token: string;
  disabled_button: boolean = false;
  hide: boolean = true;
  hide_2:boolean = true;

  constructor(private builder: FormBuilder, private commons: CommonsService, private route: ActivatedRoute) {}

  onSubmit() {
    this.disabled_button = true;
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    })
    if (this.resetPasswordForm.value.password != this.resetPasswordForm.value.confirmPassword) {
      this.error = "The passwords don't match";
    }
    else {
      this.commons.resetPassword(this.token, this.resetPasswordForm.value.password).subscribe(
        result => {
          this.message = "Your password as been reset";
          this.error = null;
        },
        error => {
          this.disabled_button = false;
          if (typeof(error.error.detail) === "string") {
            if(error.error.detail == "RESET_PASSWORD_BAD_TOKEN") {
              error.error.detail = "Your token has expired"
              this.commons.goResetTokenExpired();
            }
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

  getErrorMessagePassword() {
    if (this.password.hasError('required')) {
      return 'You must enter a password';
    }
    if (this.password.hasError('minlength')) {
      return 'At least 8 characters';
    }
    return this.password.hasError('pattern') ? 'Lower/uppercase, numbers, special characters required' : '';
  }
  getErrorMessageConfirmPassword() {
    if (this.confirmPassword.hasError('required')) {
      return 'You must enter a password';
    }
    if (this.confirmPassword.hasError('minlength')) {
      return 'At least 8 characters';
    }
    return this.confirmPassword.hasError('pattern') ? 'Lower/uppercase, numbers, special characters required' : '';
  }



}
