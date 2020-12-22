import { Component, OnInit } from '@angular/core';

import { UserInteractionService } from '../service/user-interaction.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthenticationService } from '../service/user-authentication.service';
declare const $: any; // jquery

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  /*******************************************************************************
                                  Properties
  -------------------------------------------------------------------------------
  ==============================================================================*/

  // current user data
  currentUser = localStorage.getItem('userName');
  superAdmin = (localStorage.getItem('superAdmin') === 'true') ? true : false;
  groupAdmin = (localStorage.getItem('groupAdmin') === 'true') ? true : false;
  specialUser = (this.superAdmin || this.groupAdmin) ? true : false;

  // display the group and users
  groupList = []; // list of group
  userList = []; // list of users

  // display alert when something goes wrong
  alert = false;
  alertMsg = '';

  // add channel
  groupName = '';
  editMode = false;

  /*******************************************************************************
                                      Display
  -------------------------------------------------------------------------------
  ==============================================================================*/

  // observe changes and update properties for display
  constructor(private userInteractionService: UserInteractionService, private router: Router, private userAuth: UserAuthenticationService) {
    // ovserver when thing change on this page - with users
    this.userInteractionService.actionObserver.observer$.subscribe(data => {
      if (data === 'cancel' || data === 'backToDashboard') {
        this.userList = [];
        if (this.superAdmin) {
          this.userInteractionService.getUserList().subscribe((array: any[]) => {
            this.getUserList(array);
          });
        }
      }
    });
    // observer when thing change on this page - after add new group, user, display new data
    this.userInteractionService.groupListObserver.observer$.subscribe(data => {
      this.groupList = data;
    });
    this.userInteractionService.userListObserver.observer$.subscribe(data => {
      this.getUserList(data);
    });
  }

  // get data from server and assign to properties to fisplay
  ngOnInit() {
    // if is super admin, display all the users in the database
    if (this.superAdmin) {
      this.userInteractionService.getUserList().subscribe((data: any[]) => {
        this.getUserList(data);
      });
    }
    // read from local when first launch
    this.userInteractionService.getUserDetail({ userName: localStorage.getItem('userName') }).subscribe((data: any) => {
      // if the user is either super admin or group admin, get full list
      if (this.specialUser) {
        this.userInteractionService.getGroupList().subscribe((groupData: any) => {
          if (groupData.length !== 0) {
            const newList = [];
            groupData.forEach(group => {
              newList.push({ groupName: group.groupName});
            });
            this.groupList = newList;
          }
        });
      } else {
        // normal user - get the current grouplist of the user
        if (data.groupList.length !== 0) {
          const newList = [];
          data.groupList.forEach(name => {
            newList.push({ groupName: name});
          });
          this.groupList = newList;
        }
      }
    });
  }

  /**
   * Get the group detail and redirect to group page
   * @param name name of the group
   */
  displayGroupDetail(name: string) {
    this.userInteractionService.getGroupDetail({ groupName: name.split('-').join(' ') });
    this.router.navigateByUrl('/group');
  }

  /**
   * Get list of users from database, then transform into the object that can work with other functions
   * @param userArray list of users
   */
  getUserList(userArray: any[]) {
    const newList = [];
    userArray.forEach(item => {
      if (item.userName !== localStorage.getItem('userName')) {
        const user = {
          userName: item.userName,
          selected: false,
          role0: item.superAdmin ? 'SA' : '',
          role1: item.groupAdmin ? 'GA' : ''
        };
        newList.push(user);
      }
    });
    this.userList = newList;
  }

  /*******************************************************************************
                        Other display according to user action
  -------------------------------------------------------------------------------
  ==============================================================================*/

  // when edit, edit become true
  editUser() {
    this.editMode = true;
  }

  // rest input and alert
  cancel() {
    this.userList.forEach(item => {
      item.selected = false;
    });
    this.alert = false;
    this.editMode = false;
    $('#editUserModal').modal('hide');
  }

  /*******************************************************************************
                                    Database
  -------------------------------------------------------------------------------
  ==============================================================================*/

  /**
   * assign user new role
   * @param type name of the role, super for super admin, group for group admin
   */
  assignNewRole(type: string) {
    let editRole = false;
    // initialise variables send to server
    const userRole = {
      users: [],
      newRole: ''
    };
    // determine if user are selected or not
    const selectedIndex = this.userList.findIndex(item => (item.selected));
    if (selectedIndex !== -1) {
      editRole = true;
    }
    // send data to server
    if (editRole) {
      // update varible
      this.userList.forEach(user => {
        if (user.selected) {
          if (type === 'super' && user.role0 === '') {
            userRole.users.push(user.userName);
            userRole.newRole = 'superAdmin';
          } else if (type === 'group' && user.role1 === '') {
            userRole.users.push(user.userName);
            userRole.newRole = 'groupAdmin';
          }
        }
      });
      // check if the user already have the role
      if (userRole.newRole === '') {
        this.alert = true;
        this.alertMsg = 'currently all selected users already have' + type + 'admin.';
      } else {
        // send to server
        this.userInteractionService.editRole(userRole).subscribe((newUsers: any[]) => {
          this.getUserList(newUsers);
          this.editMode = false;
          this.alert = false;
        });
      }
    } else {
      this.alert = true;
      this.alertMsg = 'no user selected';
    }
  }


  /**
   * remove user, show confirmation box ask if comfirm to remove user
   * @param name user name
   */
  removeUsers(name: string) {
    if (confirm(`Are you sure want to remove ${name}`)) {
      this.userInteractionService.removeUser({userName: name}).subscribe((data: any[]) => {
        this.getUserList(data);
        this.editMode = false;
      });
    }

  }



}
