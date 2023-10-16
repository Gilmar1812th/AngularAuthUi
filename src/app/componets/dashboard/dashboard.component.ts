import { UserStoreService } from './../../services/services/user-store.service';
import { AuthService } from './../../services/services/auth.service';
import { ApiService } from 'src/app/services/services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

public fullName : string = "";
public users: any = [];
public role!: string;

constructor(private api : ApiService,
            private auth : AuthService,
            private userStore: UserStoreService) {}

ngOnInit(): void {
    this.api.getUsers()
    .subscribe(res=>{
      this.users = res;
    });

    this.userStore.getFullNameFromStore()
    .subscribe(val=>{
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore()
    .subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    })
}

logout(){
  this.auth.signOut();
}

}
