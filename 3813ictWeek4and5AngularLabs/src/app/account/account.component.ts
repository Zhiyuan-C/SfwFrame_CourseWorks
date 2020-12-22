import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  email = sessionStorage.getItem('email');
  username = sessionStorage.getItem('username');
  birthday = sessionStorage.getItem('birthdate');
  age = sessionStorage.getItem('age');

  constructor(private router:Router) { }

  ngOnInit() {
    // back to login page if user not login yet
    if (sessionStorage.getItem('email') == null){
      this.router.navigateByUrl('/login');
    }
  }

}
