import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './componets/dashboard/dashboard.component';
import { SignupComponent } from './componets/signup/signup.component';
import { LoginComponent } from './componets/login/login.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
