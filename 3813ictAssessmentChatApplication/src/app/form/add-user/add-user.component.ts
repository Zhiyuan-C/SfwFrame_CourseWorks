import { Component, OnInit } from '@angular/core';
import { UserInteractionService } from '../../service/user-interaction.service';
import { Router } from '@angular/router';

import { User } from '../../model/collection';
import { ErrorAlert } from '../../model/common-methods';
declare const $: any; // jquery

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  /*******************************************************************************
                                  Properties
  -------------------------------------------------------------------------------
  ==============================================================================*/

  // display, and get user input
  inputName = '';
  inputEmail = '';
  inputPassword = '';
  superAdmin = false;
  groupAdmin = false;

  // display alert element
  alert = new ErrorAlert();

  /*******************************************************************************
                                      Display
  -------------------------------------------------------------------------------
  ==============================================================================*/
  constructor(private userInteractionService: UserInteractionService, private router: Router) { }

  ngOnInit() {
  }
  // reset input and alert when cancel pressed
  reset() {
    this.inputEmail = '';
    this.inputName = '';
    this.inputPassword = '';
    this.superAdmin = false;
    this.groupAdmin = false;
    this.alert.closeAlert();
    $('#userModal').modal('hide');
  }

  /*******************************************************************************
                                    Database
  -------------------------------------------------------------------------------
  ==============================================================================*/

  // create new user
  addUser() {
    /* email and user validation
    email
    - all charactors from a to z and A to Z
    - all numbers,
    - speicial chars only _.-
    username
    - all charactors from a to z and A to Z
    - all numnbers,
    - special chars only _
    */
    const emailRegex = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-.]+(?:co|au|jp|com|org|net)$');
    const validEmail = emailRegex.test(this.inputEmail);
    const usernameRegex = new RegExp('^[a-zA-Z0-9_]+$');
    const validUsername = usernameRegex.test(this.inputName);

    // check if input are empty
    if (this.inputName === '' || this.inputEmail === '' || this.inputPassword === '') {
      this.alert.showAlert('Empty input, makesure you have entered all the fields');
    } else {
      if (!validEmail) {
        // show alert if email address not valid
        this.alert.showAlert('Not valid email address, please check your email adrees again');
      } else {
        if (!validUsername) {
          // show alert if user name is not valid
          this.alert.showAlert('Not valid username, username should only contain letters, numbers and underline');
        } else {
          // check password length
          if (this.inputPassword.length < 6) {
            this.alert.showAlert('Password too short, should have password more than 6 characters');
          } else {
            // create new user
            const user = new User(this.inputName, this.inputEmail, this.inputPassword, '', false, this.superAdmin, this.groupAdmin, [], []);
            this.userInteractionService.addUser(user).subscribe((newUser: any) => {
              if (newUser.status === false) {
                // show alert depend on the error: such as user already exists
                this.alert.showAlert(newUser.msg);
              } else {
                this.userInteractionService.getUserList().subscribe(data => {
                  // update dashboard's user list
                  this.userInteractionService.userListObservable(data);
                });
                this.reset(); // reset input and alert
                $('#userModal').modal('hide');
              }
            });
          }
        }
      }
    }
  }


}
