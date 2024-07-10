import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonsService } from '../main/commons.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountComponent } from './delete-account/delete-account.component';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent {
  message_change: string;
  disabled_change: boolean = false;
  mail = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(private commons: CommonsService, public dialog: MatDialog) {}

  sendChangePassword() {
    this.disabled_change = true;
    this.message_change = null;
    this.commons.changePassword().subscribe(
      result => {
        this.message_change = "Change password e-mail has been sent to your address";
        this.disabled_change = false;
      },
    );
  }

  sendDeleteAccount() {
    const dialogRef = this.dialog.open(DeleteAccountComponent, {
      width: '60%',
    });
  }
}