import { Router, RouterModule } from '@angular/router';
import { AuthService } from './../../services/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import ValidateForm from 'src/app/helpers/validateform';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signupForm!:FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group ({
      firtsname: ['',Validators.required],
      lastname: ['',Validators.required],
      username: ['',Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required]
    })
  };

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSignup(){
    if(this.signupForm.valid){
      // send the object to database
      this.auth.signUp(this.signupForm.value)
      .subscribe({
        next:(res=>{
          alert(res.message);
          this.signupForm.reset();
          this.router.navigate(['login']);
        })
        , error:(err=>{
          alert(err?.error.message);
        })
      })
      console.log(this.signupForm.value)
    }else{
      // throw the error using toaster and with required fields
      //console.log("Form is not valid")
      ValidateForm.validateAllFormFields(this.signupForm);
      alert("Seu formulário é inválido")
    }
  }
}
