import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { AuthGuard } from './core/guards/auth.guard';
import { BlogListComponent } from './blog/blog-listing/blog-listing.component';
import { BlogWriteComponent } from './blog/blog-write/blog-write.component';


const routes: Routes = [
  // Public landing page for non-authenticated users
  { path: '', component: HomeComponent, canActivate: [AuthGuard], data: { authGuardRedirect: '/blogs' } },
  
  // Protected routes - require authentication
  { path: 'blogs', component: BlogListComponent, canActivate: [AuthGuard], data: { requiresAuth: true } },
  { path: 'blog/:id', component: BlogDetailComponent, canActivate: [AuthGuard], data: { requiresAuth: true } },
  { path: 'write', component: BlogWriteComponent, canActivate: [AuthGuard], data: { requiresAuth: true } },
  
  // Fallback route
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }