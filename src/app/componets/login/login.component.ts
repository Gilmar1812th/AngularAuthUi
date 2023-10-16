import { UserStoreService } from './../../services/services/user-store.service';
import { AuthService } from './../../services/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateform';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private toast: NgToastService,
              private userStore: UserStoreService
              ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    })
  };

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin(){
    if(this.loginForm.valid){
      // send the object to database
      this.auth.login(this.loginForm.value)
      .subscribe({
        next:(res=>{
          //console.log(res.message);
          this.loginForm.reset();
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          const tokenPayLoad = this.auth.decodedToken();
          this.userStore.setFullNameForStore(tokenPayLoad.name);
          this.userStore.setRoleForStore(tokenPayLoad.role);
          //alert(res.message);
          this.toast.success({detail:"SUCESSO", summary:res.message, duration: 5000}); // 5 segundos
          this.router.navigate(['dashboard'])
        })
        , error:(err=>{
          //alert(err?.error.message);
          this.toast.error({detail:"ERRO", summary:"Usuário não encontrado!", duration: 5000}); // 5 segundos
          //console.log(err);
        })
      })
      console.log(this.loginForm.value)
    }else{
      // throw the error using toaster and with required fields
      //console.log("Form is not valid")
      ValidateForm.validateAllFormFields(this.loginForm);
      //alert("Seu formulário é inválido")
      this.toast.error({detail:"ERRO", summary:"Dados inválidos!", duration: 5000}); // 5 segundos
    }
  }

  checkValidEmail(event: string){
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }
}
