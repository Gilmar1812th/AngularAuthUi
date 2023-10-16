import { TokenApiModel } from './../models/token-api.model';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from './../services/services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth : AuthService,
             private toast: NgToastService,
             private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();

    if(myToken) {
      request = request.clone({
        setHeaders: {Authorization : `Bearer ${myToken}`}
      })
    }

    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            //this.toast.warning({detail: "Atenção", summary:"Token expirado, efetue o login novamente"});
            //this.router.navigate(['login'])
            //handle
            return this.handleUnAuthorizedError(request, next);
          }
        }
        return throwError(()=> new Error("Algum outro erro ocorreu"))
      })
    );
  }
  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler){
    let tokenApiModel = new TokenApiModel();
    tokenApiModel.acessToken = this.auth.getToken()!;
    tokenApiModel.refreshToken = this.auth.getRefreshToken()!;
    return this.auth.renewToken(tokenApiModel)
    .pipe(
      switchMap((data: TokenApiModel) => {
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.acessToken);
        req = req.clone({
          setHeaders: {Authorization : `Bearer ${data.acessToken}`}
        })

        return next.handle(req);
      }),
      catchError((err)=> {
        return throwError(()=>{
            this.toast.warning({detail: "Atenção", summary:"Token expirado, efetue o login novamente"});
            this.router.navigate(['login'])
        })
      })
    )
  }
}
