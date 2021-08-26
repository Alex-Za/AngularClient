import { AddPostComponent } from './user/add-post/add-post.component';
import { UserPostsComponent } from './user/user-posts/user-posts.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AuthGuardService } from './helper/auth-guard.service';
import { IndexComponent } from './layout/index/index.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'main', component: IndexComponent, canActivate: [AuthGuardService]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: UserPostsComponent, canActivate: [AuthGuardService]},
    {path: 'add', component: AddPostComponent, canActivate: [AuthGuardService]}
  ]},
  {path: '', redirectTo: 'main', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
