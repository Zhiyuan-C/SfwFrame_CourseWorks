import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  email = sessionStorage.getItem('email');
  username = sessionStorage.getItem('username');
  birthdate = sessionStorage.getItem('birthdate');
  age = sessionStorage.getItem('age');

  newEmail = "";
  newName = "";
  newBirth = "";
  newAge = "";

  constructor(private router:Router) { }

  ngOnInit() {
    // back to login page if user is not loggedin
    if (sessionStorage.getItem('email') == null){
      this.router.navigateByUrl('/login');
    }

  }

  edit(){
    this.editSessionSt("email", this.newEmail);
    this.editSessionSt("username", this.newName);
    this.editSessionSt("birthdate", this.newBirth);
    this.editSessionSt("age", this.newAge);
    this.router.navigateByUrl('/account');
    
  }
  
  editSessionSt(key, value){
    if (value != ""){
      sessionStorage.setItem(key, value);
    }

  }

}
