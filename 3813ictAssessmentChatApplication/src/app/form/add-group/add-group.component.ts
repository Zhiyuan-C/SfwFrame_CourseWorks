import { Component, OnInit } from '@angular/core';
import { UserInteractionService } from '../../service/user-interaction.service';
import { UserAuthenticationService } from '../../service/user-authentication.service';
import { Router } from '@angular/router';
import { Group, GroupUser } from '../../model/collection';
import { ErrorAlert } from '../../model/common-methods';
declare const $: any; // jquery

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  /*******************************************************************************
                                  Properties
  -------------------------------------------------------------------------------
  ==============================================================================*/
  // initialise properties for display ngmodel
  name = '';
  userList = [];
  alert = new ErrorAlert();

  /*******************************************************************************
                                      Display
  -------------------------------------------------------------------------------
  ==============================================================================*/
  constructor(private userInteract: UserInteractionService, private userAuth: UserAuthenticationService, private router: Router) {
    // get user list to add in the group
    this.userInteract.getUserList().subscribe((data: any[]) => {
      this.displayUserList(data);
    });
    // observer any changes to the user list
    this.userInteract.userListObserver.observer$.subscribe((data: any[]) => {
      this.displayUserList(data);
    });
  }

  ngOnInit() {
  }

  /**
   * set userList property with given user array
   * @param userArray user list
   */
  displayUserList(userArray: any[]) {
    this.userList = [];
    userArray.forEach(item => {
      if (item.userName !== localStorage.getItem('userName')) {
        const user = { userName: item.userName, selected: false, userAvatar: item.userAvatar };
        this.userList.push(user);
      }
    });
  }

  // reset user input and alert when cancel pressed
  reset() {
    this.name = '';
    this.userList.forEach(item => {
      item.selected = false;
    });
    this.alert.closeAlert();
  }

  /*******************************************************************************
                                    Database
  -------------------------------------------------------------------------------
  ==============================================================================*/
  // create group and send to server to add into data file
  addGroup() {
    // check if the group name is empty, if not empty proceed, else error
    if (this.name === '') {
      this.alert.showAlert('empty group name');
    } else {
      this.alert.closeAlert();

      // check if the name contains any special characters
      const nameRegex = new RegExp('[^a-zA-Z0-9 ]');
      const specialCharacters = nameRegex.test(this.name);
      if (specialCharacters) {
        this.alert.showAlert('Group name should only contain letters, numbers and spaces');
      } else {
        this.alert.closeAlert();

        // initialise object that need to be send to server
        const groupData = new Group(this.name, [], localStorage.getItem('userName'));
        const groupUserArray = [];
        // get selected users
        this.userList.forEach(item => {
          if (item.selected) {
            const grpUsrData = new GroupUser(this.name, item.userName, item.userAvatar, false);
            groupUserArray.push(grpUsrData);
          }
        });

        // send data to server and subscribe the return data to update
        this.userInteract.addGroup([groupData, groupUserArray]).subscribe((data: any) => {
          if (data.status === false) {
            this.alert.showAlert(data.msg);
          } else {
            this.userInteract.getGroupList().subscribe((groupDataList) => {
              this.userInteract.groupListObservable(groupDataList);
            });
            this.reset();
            $('#groupModal').modal('hide');
          }
        });
      }
    }

  }



}
