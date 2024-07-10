import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonsService } from '../main/commons.service';

@Component({
  selector: 'app-auth',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  error: string;
  hide: boolean = true;
  waiting: boolean = false;

  constructor(private fb: FormBuilder, private commons: CommonsService, public router: Router) {
    this.authForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.authForm.value.login == "") {
      this.error = "Login required";
    }
    if (this.authForm.value.password == "") {
      this.error = "Password required";
    }
    if (this.authForm.value.password != "" && this.authForm.value.login != "") {
      this.waiting = true;
      this.commons.loginUser(this.authForm.value.login, this.authForm.value.password).subscribe({
        next: (user) => {
          if (user == null) {
            this.router.navigate([this.commons.redirectUrl]);
          }
        },
        error: (error) => {
          this.waiting = false;
          this.error = error.error.detail;
          if (this.error == "LOGIN_BAD_CREDENTIALS") {
            this.error = "Incorrect username or password"
          }
        }
      }
      );
    }
  }
}
