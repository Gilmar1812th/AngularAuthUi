import { NgToastService } from 'ng-angular-popup';
import { AuthService } from './../services/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth : AuthService,
              private router : Router,
              private toast : NgToastService) {}

  canActivate():boolean{
    if(this.auth.isLoggedIn()){
      return true
    } else {
      this.toast.error({detail:"ERRO", summary:"Por favor faça o login primeiro!"});
      this.router.navigate(['login'])
      return false;
    }
  }
}
