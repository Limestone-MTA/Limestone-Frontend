import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonsService } from '../main/commons.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  mail = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(12),
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z0-9$@$!%*?&].{11,}') 
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z0-9$@$!%*?&].{11,}')
  ]);

  registerForm: FormGroup = this.builder.group({
    mail: this.mail,
    password: this.password,
    confirmPassword: this.confirmPassword,
  });

  error: string;
  hide: boolean = true;
  hide_2: boolean = true;
  disabled: boolean = false;
  constructor(private builder: FormBuilder, private commons: CommonsService, public router: Router) {}

  onSubmit() {
    this.error = null;
    if (this.registerForm.value.password.includes(";")) {
      this.error = "You can't have a \";\" in your password";
    }
    if (this.registerForm.value.password != this.registerForm.value.confirmPassword) {
      this.error = "Passwords do not match";
    }
    if (this.getErrorMessageMail() == "" && this.getErrorMessagePassword() == "" && this.getErrorMessageConfirmPassword()=="") {
      this.disabled = true;
      this.commons.registerUser(this.registerForm.value.mail, this.registerForm.value.password).subscribe(
        user => {
          if (user) {
            this.router.navigate(["/mail-sent"]);
          }
        },
        error => {
          this.disabled = false;
          if (typeof(error.error.detail) === "string") {
            this.error = error.error.detail;
          }
          else if (typeof(error.error.detail.reason) === "string") {
            this.error = error.error.detail.reason;
          }
          else {
            this.error = error.error.detail[0].msg;
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
  getErrorMessagePassword() {
    if (this.password.hasError('required')) {
      return 'You must enter a password';
    }
    if (this.password.hasError('minlength')) {
      return 'At least 12 characters';
    }
    return this.password.hasError('pattern') ? 'lower/uppercase, numbers, special characters required' : '';
  }
  getErrorMessageConfirmPassword() {
    if (this.confirmPassword.hasError('required')) {
      return 'You must enter a password';
    }
    if (this.confirmPassword.hasError('minlength')) {
      return 'At least 12 characters';
    }
    if (this.registerForm.value.password != this.registerForm.value.confirmPassword) {
      return 'Passwords do not match';
    }
    return this.confirmPassword.hasError('pattern') ? 'lower/uppercase, numbers, special characters required' : '';
  }
}
