import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { BlogListComponent } from './blog/blog-listing/blog-listing.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthModalContainerComponent } from './shared/auth-modal/auth-modal-container.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlogWriteComponent } from './blog/blog-write/blog-write.component';
import { BlogSuccessModalComponent } from './blog/blog-success-modal/blog-success-modal.component';
import { BlogEditorComponent } from './blog/blog-editor/blog-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    BlogDetailComponent,
    BlogListComponent,
    NavbarComponent,
    FooterComponent,
    AuthModalContainerComponent,
    BlogWriteComponent,
    BlogSuccessModalComponent,
    BlogEditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }