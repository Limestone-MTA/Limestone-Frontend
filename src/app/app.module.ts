import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule  } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AsComponent } from './as/as.component';
import { AuthComponent } from './signin/signin.component';
import { AuthGuardService } from './main/auth-guard.service';
import { ProjectComponent } from './project/project.component';
import { ProjectNewComponent } from './project-new/project-new.component';
import { ProjectsComponent } from './projects/projects.component';
import { QcComponent } from './qc/qc.component';
import { ResultComponent } from './result/result.component';
import { ResultFinalComponent } from './result-final/result-final.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';
import { ScientificPipe } from './main/scientific.pipe';
import { CommonsService } from './main/commons.service';
import { HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegexAsDialogComponent } from './as/regex-as-dialog/regex-as-dialog.component';
import { VarDialogComponent } from './qc/var-dialog/var-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HelpComponent } from './help/help.component';
import { DataPostQcComponent } from './qc/data-post-qc/data-post-qc.component';
import { ManualQcComponent } from './qc/manual-qc/manual-qc.component';
import { RegexQcDialogComponent } from './qc/regex-qc-dialog/regex-qc-dialog.component';
import { MissingRuleComponent } from './qc/missing-rule/missing-rule.component';
import { ResultDialogComponent } from './result-final/result-dialog/result-dialog.component';
import { DataProjectComponent } from './project/data-project/data-project.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { ProjectDialogComponent } from './project/project-detail/project-dialog/project-dialog.component';
import { RegisterComponent } from './register/register.component';
import { ManageCollaboratorComponent } from './project/project-detail/manage-collaborator/manage-collaborator.component';
import { QAComponent } from './qa/qa.component';
import { DeleteWarningComponent } from './project/project-detail/delete-warning/delete-warning.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetTokenExpiredComponent } from './reset-token-expired/reset-token-expired.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EmailVerifiedComponent } from './email-verified/email-verified.component';
import { EmailSentComponent } from './email-sent/email-sent.component';
import { LowCountRuleComponent } from './qc/low-count-rule/low-count-rule.component';
import { OutliersRuleComponent } from './qc/outliers-rule/outliers-rule.component';
import { HomeComponent } from './home/home.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { VarDetailComponent } from './project/var-detail/var-detail.component';
import { DeleteAccountComponent } from './my-account/delete-account/delete-account.component';
import { ResultWarningsComponent } from './result-final/result-warnings/result-warnings.component';
import { DataTransformationComponent } from './data-transformation/data-transformation.component';
import { BinaryDialogComponent } from './data-transformation/binary-dialog/binary-dialog.component';
import { DataPreQcComponent } from './qc/data-pre-qc/data-pre-qc.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AsComponent,
    AuthComponent,
    ProjectComponent,
    ProjectNewComponent,
    ProjectsComponent,
    QcComponent,
    ResultComponent,
    ResultFinalComponent,
    RegexAsDialogComponent,
    VarDialogComponent,
    HelpComponent,
    DataPostQcComponent,
    ManualQcComponent,
    RegexQcDialogComponent,
    MissingRuleComponent,
    ResultDialogComponent,
    DataProjectComponent,
    ProjectDetailComponent,
    ProjectDialogComponent,
    ScientificPipe,
    RegisterComponent,
    ManageCollaboratorComponent,
    QAComponent,
    DeleteWarningComponent,
    ForgotPasswordComponent,
    ResetTokenExpiredComponent,
    ResetPasswordComponent,
    EmailVerifiedComponent,
    EmailSentComponent,
    LowCountRuleComponent,
    OutliersRuleComponent,
    HomeComponent,
    MyAccountComponent,
    VarDetailComponent,
    DeleteAccountComponent,
    ResultWarningsComponent,
    DataTransformationComponent,
    BinaryDialogComponent,
    DataPreQcComponent
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    NgxChartsModule,
    RouterModule
  ],
  providers: [AuthGuardService,CommonsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
