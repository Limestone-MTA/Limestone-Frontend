import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './project/project.component';
import { ProjectNewComponent } from './project-new/project-new.component';
import { QcComponent } from './qc/qc.component';
import { AsComponent } from './as/as.component';
import { ResultComponent } from './result/result.component';
import { AuthComponent } from './signin/signin.component';
import { NavComponent } from './nav/nav.component';
import { AuthGuardService } from './main/auth-guard.service';
import { RegisterComponent } from './register/register.component';
import { QAComponent } from './qa/qa.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetTokenExpiredComponent } from './reset-token-expired/reset-token-expired.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EmailVerifiedComponent } from './email-verified/email-verified.component';
import { EmailSentComponent } from './email-sent/email-sent.component';
import { HomeComponent } from './home/home.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { DataTransformationComponent } from './data-transformation/data-transformation.component';

const routes: Routes = [
  { path: 'signin', component: AuthComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mail-sent', component: EmailSentComponent },
  { path: 'verify', component: EmailVerifiedComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-token-expired', component: ResetTokenExpiredComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '', component: NavComponent, canActivate: [AuthGuardService],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'account', component: MyAccountComponent },
      { path: 'QA', component: QAComponent },
      { path: 'p', component: ProjectsComponent },
      { path: 'p/:id', component: ProjectComponent },
      { path: 'new', component: ProjectNewComponent },
      { path: 'dt/:id', component: DataTransformationComponent },
      { path: 'qc/:id', component: QcComponent },
      { path: 'as/:id', component: AsComponent },
      { path: 'r/:id', component: ResultComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
