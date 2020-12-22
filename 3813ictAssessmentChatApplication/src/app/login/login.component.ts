import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthenticationService } from '../service/user-authentication.service';
import { UserInteractionService } from '../service/user-interaction.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /*******************************************************************************
                                  Properties
  -------------------------------------------------------------------------------
  ==============================================================================*/
  user = { userName: '', password: ''}; // user name
  notValid = false; // if user is logged in
  alert = false; // display alert element
  alertMsg = ''; // alert message

  /*******************************************************************************
                                      Display
  -------------------------------------------------------------------------------
  ==============================================================================*/
  constructor(private router: Router, private userAuth: UserAuthenticationService, private userInteract: UserInteractionService) { }

  ngOnInit() {
  }

  displayAlert(msg: string) {
    this.notValid = true;
    this.alert = true;
    this.alertMsg = msg;
  }
  dismissAlert() {
    this.notValid = true;
    this.alert = false;
    this.alertMsg = '';
  }

  /*******************************************************************************
                                    Database
  -------------------------------------------------------------------------------
  ==============================================================================*/
  // Login into chat app
  login() {
    // Input validation : input filed not to be empty
    let inputValid = false;
    if (this.user.userName === '' || this.user.userName === '') {
      inputValid = false;
      this.displayAlert('No username or password, please make sure you entered both');
    } else {
      inputValid = true;
      this.dismissAlert();
    }

    // No empty input, proceed login
    if (inputValid) {
      // subscribe to user detail data
      this.userAuth.login(this.user).subscribe((data: any) => {
        // check if user is exsist in the data file
        if (data.status === undefined) {
          // user input correct data
          // store user into local storage
          localStorage.setItem('userName', data.userName);
          localStorage.setItem('superAdmin', data.superAdmin);
          localStorage.setItem('groupAdmin', data.groupAdmin);

          // pass relavent data to make it observable
          this.userAuth.isValid(data);

          // reset input val
          this.user = { userName: '', password: ''};
          this.router.navigateByUrl('/dashboard');
        } else {
          // user login fail, display error message
          this.displayAlert(data.msg);
        }
      });
    }
  }

}
