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
import { DocumentationComponent } from './documentation/documentation.component';
import { TutorialComponent } from './documentation/tutorial/tutorial.component';
import { WelcomeToLimestoneComponent } from './documentation/welcome-to-limestone/welcome-to-limestone.component';
import { FileFormatComponent } from './documentation/file-format/file-format.component';
import { DocDataTransformationComponent } from './documentation/doc-data-transformation/doc-data-transformation.component';
import { DocQualityControlComponent } from './documentation/doc-quality-control/doc-quality-control.component';
import { TutorialVariableSelectionComponent } from './documentation/tutorial-variable-selection/tutorial-variable-selection.component';
import { TutorialResultsComponent } from './documentation/tutorial-results/tutorial-results.component';
import { LicenseComponent } from './documentation/license/license.component';

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
      { path: 'p', component: ProjectsComponent },
      { path: 'p/:id', component: ProjectComponent },
      { path: 'new', component: ProjectNewComponent },
      { path: 'dt/:id', component: DataTransformationComponent },
      { path: 'qc/:id', component: QcComponent },
      { path: 'as/:id', component: AsComponent },
      { path: 'r/:id', component: ResultComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'QA', component: QAComponent },
      { path: 'documentation', component: DocumentationComponent, 
        children: [
          { path: 'welcome_to_limestone', component: WelcomeToLimestoneComponent },
          { path: 'tutorial', component: TutorialComponent },
          { path: 'file_format', component: FileFormatComponent },
          { path: 'data_transformation', component: DocDataTransformationComponent },
          { path: 'quality_control', component: DocQualityControlComponent },
          { path: 'variable_selection', component: TutorialVariableSelectionComponent },
          { path: 'results', component: TutorialResultsComponent },
          { path: 'license', component: LicenseComponent },
          { path: '', redirectTo: 'welcome_to_limestone', pathMatch: 'full' },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
