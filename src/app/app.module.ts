import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { WINDOW_PROVIDERS } from './window.service';
import { AdminLogInComponent } from './Admin/admin-login/admin-log-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MAT_CHECKBOX_CLICK_ACTION,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatExpansionModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatMenuModule, MatPaginatorModule, MatRadioModule,
  MatSelectModule, MatSnackBarModule, MatSortModule,
  MatStepperModule, MatTableModule, MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdminHomeComponent } from './Admin/admin-home/admin-home.component';
import { AdminNavComponent } from './Admin/admin-nav/admin-nav.component';
import { AddFileComponent } from './Files/add-file/add-file.component';
import { AdminSetupComponent } from './Admin/admin-setup/admin-setup.component';
import { LoaderModule } from './Common/Loader';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddContactDialogComponent } from './Files/add-contact-dialog/add-contact-dialog.component';
import { FileTableComponent } from './Files/file-table/file-table.component';
import { CdkDetailRowDirective } from './Files/file-table/cdk-detail-row.directive';
import { FileService } from './Files/file.service';
import { AddCommentDialogComponent } from './Files/add-comment-dialog/add-comment-dialog.component';
import { ContactLogInComponent } from './Contact/contact-log-in/contact-log-in.component';
import { FileComponent } from './Files/file/file.component';
import { ContactNavComponent } from './Contact/contact-nav/contact-nav.component';




@NgModule({
  declarations: [
    AppComponent,
    AdminLogInComponent,
    AdminHomeComponent,
    AdminNavComponent,
    AddFileComponent,
    AdminSetupComponent,
    AddContactDialogComponent,
    FileTableComponent,
    CdkDetailRowDirective,
    AddCommentDialogComponent,
    ContactLogInComponent,
    FileComponent,
    ContactNavComponent
  ],
  imports: [
    MatInputModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatCardModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatCardModule,
    DragDropModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LoaderModule,
    FormsModule
  ],
  providers: [
    AuthService,
    FileService,
    WINDOW_PROVIDERS,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue:  {duration: 3000}}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddContactDialogComponent,
    AddCommentDialogComponent
  ]
})
export class AppModule { }
