import { Component } from '@angular/core';
import { CommonsService } from 'src/app/main/commons.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {

  constructor(private commons: CommonsService) {
  }
  
  deleteProject(): void{
    this.commons.logout();
    this.commons.deleteAccount();
    setTimeout(function () {
      location.reload();
    }, 100);
    this.commons.goFrontpage();
  }
}
