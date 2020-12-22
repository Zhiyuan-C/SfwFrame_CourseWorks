import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { PostsService } from "../posts.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userEmail = "";
  userPassword = "";
  display = false; // to display error message
  correct = false; // to check if credential matches

  displayLogout = false;


  constructor( private router:Router, private postService: PostsService ) {}

  ngOnInit() {
    this.displayLogout = true;
    if(sessionStorage.getItem('email') != null){
      this.router.navigateByUrl('/');
    }
  }

  buttonClicked(){
    this.postService.getUser().subscribe(data=>{
      for (let i in data){
        // check if email and password correct
        if(this.userEmail == data[i].email && this.userPassword == data[i].password){
          this.correct = true;
          this.postService.isValid(true); // add to observavle
          // store user data into session storage
          for(let k in data[i]){
            if (k =="password"){
              break;
            }
            sessionStorage.setItem(k, data[i][k]);
          }
          // redirect back to home
          this.router.navigateByUrl("/");
          break;
        }
      }
      // display error message when email and password not correct
      if (this.correct == false){
        this.display = true;
        this.userEmail = "";
        this.userPassword = "";
      }
    });
  }

}
