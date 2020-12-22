import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PostsService } from "./posts.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Week4AngularLabs3813ICT';
  loggedIn = false;
  constructor(private router: Router, private postService: PostsService){
    // subscribe observable data from server if the user has successfully loggedin
    this.postService.userStatus$.subscribe(data => {
      if (data == true){
        this.loggedIn = true;
      }
    });
  }
  ngOnInit(){
    // determine if user already logged, session data
    if (sessionStorage.getItem('email')!=null){
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }
  // logout function, logout the user and clear session storage
  logout(){
    sessionStorage.clear();
    this.loggedIn = false;
    this.router.navigateByUrl('/login');
  }
}
