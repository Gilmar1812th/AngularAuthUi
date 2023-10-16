import { TokenApiModel } from './../../models/token-api.model';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://localhost:7205/api/User/"
  private userPayLoad:any;

  constructor(private http: HttpClient,
              private router : Router) {
                this.userPayLoad = this.decodedToken();
              }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  login(loginObj: any){
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);
  }

  signOut(){
    localStorage.clear();
    //localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue);
  }

  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  // Checa se existe retorna true (!!)
  isLoggedIn():boolean{
    return !!localStorage.getItem('token');
  }

  decodedToken(){
    const jwtHelper = new JwtHelperService()
    // this.getToken()! (!) pode ser indefinido
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  getfullNameFromToken(){
    if(this.userPayLoad)
      return this.userPayLoad.name;
  }

  getRoleFromToken(){
    if(this.userPayLoad)
      return this.userPayLoad.role;
  }

  renewToken(tokenApi : TokenApiModel){
    return this.http.post<any>(`${this.baseUrl}refresh`,tokenApi)
  }
}
