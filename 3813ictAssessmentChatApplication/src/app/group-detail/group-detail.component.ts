import { Component, OnInit } from '@angular/core';
import { UserInteractionService } from '../service/user-interaction.service';
import { Router } from '@angular/router';
import { UserAuthenticationService } from '../service/user-authentication.service';
import { ErrorAlert } from '../model/common-methods';
import { GroupUser } from '../model/collection';
declare const $: any; // jquery

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {

  /*******************************************************************************
                                  Properties
  -------------------------------------------------------------------------------
  ==============================================================================*/
  superAdmin = (localStorage.getItem('superAdmin') === 'true') ? true : false; // if current user is super admin
  currentUser = localStorage.getItem('userName'); // curent user name

  groupName = ''; // group name
  channelList = []; // channel list the group have
  userList = []; // group user list
  userLiNotInGp = []; // list of users not in the group
  groupAssist = []; // list of group assist

  alert = new ErrorAlert(); // display alert element

  editMode = false; // display element when is in edit mode

  isCollapse = false; // collapse element if is open

  /*
  Permmission
  Level 0 - Create & Remove Group, Remove Channel, add user & remove user from group, view all users in the group
    Super Admin, Group Admin

  Lebel 1 - Add & Remove User from channel + Create channel + View all channels
    Super Admin, Group Admin, Group Assis
  */
  lv0Permission = false;
  lv1Permission = false;

  /*******************************************************************************
                                      Display
  -------------------------------------------------------------------------------
  ==============================================================================*/
  constructor(private userInteractionService: UserInteractionService, private router: Router, private userAuth: UserAuthenticationService) {
    this.displayContent();
  }

  // get current user permission
  ngOnInit() {
    const groupAdmin = (localStorage.getItem('groupAdmin') === 'true') ? true : false;
    this.lv1Permission = (this.superAdmin || groupAdmin) ? true : false;
    this.lv0Permission = (this.superAdmin || groupAdmin) ? true : false;
  }

  // display data retrieved from server
  displayContent() {
    this.userInteractionService.groupDetailObserver.observer$.subscribe((data) => {
      // Initialise property again to prevent old data left there
      this.groupName = data.groupName;

      this.userLiNotInGp = [];
      this.isCollapse = false;

      // update user list for display
      this.userInteractionService.getGroupUser({groupName: data.groupName}).subscribe((users: any[]) => {
        this.displayUserList(users);
        // update channel list for display
        let currentAssistRole = false;
        users.forEach(item => {
          if (localStorage.getItem('userName') === item.userName) {
            currentAssistRole = item.groupAssist;
          }
        });
        this.userInteractionService.getUserDetail({userName: localStorage.getItem('userName')}).subscribe((user: any) => {
          // if current user is super admin or group admin or group assist, display all channels
          if (user.superAdmin || user.groupAdmin || currentAssistRole) {
            this.channelList = data.groupChannel;
            this.lv1Permission = true;
          } else {
            // display the channel only user are in the channel
            this.displayChannelList(data.groupName);
          }
        });
      });
    });
  }


  /**
   * get user detail to update property
   * @param groupUserList group user list
   */
  displayUserList(groupUserList: any[]) {
    this.userList = [];
    groupUserList.forEach(user => {
      // initialise object
      const newUser = {
        userName: '',
        selected: false,
        userAvatar: '',
        groupAdmin: false,
        groupAssist: false
      };
      // get user data by compare user name in group list with user name in user data file
      this.userInteractionService.getUserList().subscribe((userData: any[]) => {
        userData.forEach(item => {
          if (item.userName === user.userName) {
            // update variables
            newUser.userName = user.userName;
            newUser.groupAdmin = item.groupAdmin;
            newUser.userAvatar = user.userAvatar;
            newUser.groupAssist = user.groupAssist;
            // update current user list
            this.userList.push(newUser);
          }
        });
      });
    });
  }

  /**
   * get channel list for display if the user is normal user
   *
   * @param gName group name
   */
  displayChannelList(gName: string) {
    this.channelList = [];
    this.userInteractionService.getChannelList({groupName: gName}).subscribe((data: any) => {
      data.forEach(channel => {
        this.userInteractionService.getChannelUser({groupName: gName, channelName: channel.channelName}).subscribe((chUser: any[]) => {
          const i = chUser.findIndex(name => ((name.userName === localStorage.getItem('userName'))));
          if (i !== -1) {
            this.channelList.push(channel.channelName);
          }
        });
      });
    });
  }

  // get a list contains user name that are not in the group yet
  getUserLsNotInGp() {
    // get total user list
    this.userInteractionService.getUserList().subscribe((data: any[]) => {
      const total = [];
      const newList = [];

      // get list only contain user name
      data.forEach(item => {
        total.push(item.userName);
      });

      // remove user that already exist
      this.userList.forEach(groupUsr => {
        const i = total.findIndex(usr => ((usr === groupUsr.userName)));
        if (i >= 0) {
          total.splice(i, 1);
        }
      });
      // update list
      this.userLiNotInGp = [];
      total.forEach(totalUserName => {
        data.forEach(user => {
          if ( totalUserName === user.userName ) {
            this.userLiNotInGp.push({ userName: totalUserName, selected: false, userAvatar: user.userAvatar});
          }
        });
      });
    });
  }

  /*******************************************************************************
                        Other display according to user action
  -------------------------------------------------------------------------------
  ==============================================================================*/
  // if click edit button then edit mode is true
  editUserMode() {
    this.editMode = true;
  }

  // if click cancel button, then reset input and alert
  cancel() {
    this.alert.closeAlert();
    this.userList.forEach(item => {
      item.selected = false;
    });
    this.userLiNotInGp.forEach(item => {
      item.selected = false;
    });
    this.editMode = false;
  }

  // if click, then get user list that are not in the group
  getUserNotInGp() {
    // this.isCollapse = true;
    this.getUserLsNotInGp();
  }

  // if click cancel button, then reset input and alert
  cancelAddUser() {
    this.userLiNotInGp.forEach(item => {
      item.selected = false;
    });
    this.alert.closeAlert();
    $('#addUserModal').modal('hide');
  }

  /*******************************************************************************
                                    Database
  -------------------------------------------------------------------------------
  ==============================================================================*/

              /*----------------------------------------------------------
                                      Group User
                -----------------------------------------------------------
                > add new user
                > remove user
                > assign user group assit role
                ----------------------------------------------------------*/

  /**
   * add user to group or remove user from group
   * @param type add or remove
   */
  editUser(type: string) {
    const dataSendToServer = {
      groupName: this.groupName,
      addedNewUsers: [], // newly added user list
      removedUsers: [] // user list that removed from group
    };
    let userSelected = false; // check if user is selected

    // if add user
    if (type === 'add') {
      this.userLiNotInGp.forEach(user => {
        if (user.selected) {
          userSelected = true;
          dataSendToServer.addedNewUsers.push(new GroupUser(this.groupName, user.userName, user.userAvatar, false));
        }
      });
    } else {
      // remove user
      this.userList.forEach((user, index) => {
        if (user.selected) {
          userSelected = true;
          dataSendToServer.removedUsers.push(new GroupUser(this.groupName, user.userName, user.userAvatar, user.groupAssist));
        }
      });
    }

    // if there are user been selected, then send reqst to server to update user data
    if (!userSelected) {
      // no user selected
      this.alert.showAlert('No user select');
    } else {
      this.alert.closeAlert();
      this.userInteractionService.editGroupUser(dataSendToServer).subscribe((result: any) => {
        if (result.status !== undefined) {
          this.alert.showAlert(result.msg);
        }
        // this.isCollapse = false;
        $('#addUserModal').modal('hide');
        this.editMode = false;
        this.displayUserList(result);
      });
    }
  }

  // assign user assit role
  addAssist() {
    let newAssistRole = false;
    let newAssist = false;
    const newRole = {
      groupName: this.groupName,
      users: []
    };
    // check if any user has been selected
    const selectedIndex = this.userList.findIndex(item => (item.selected));
    if (selectedIndex !== -1) {
      newAssistRole = true;
    }
    if (!newAssistRole) {
      this.alert.showAlert('No user selected');
    } else {
      this.userList.forEach(user => {
        // check if user is group assist, if not add to list
        if (user.selected) {
          if (user.groupAssist === false) {
            newAssist = true;
            newRole.users.push(user.userName);
          }
        }
      });
      if (!newAssist) {
        this.alert.showAlert('selcted user/s is/are already group assist');
      } else {
        this.userInteractionService.editGroupUserRole(newRole).subscribe((data: any) => {
          this.editMode = false;
          this.userList = [];
          this.alert.closeAlert();
          this.displayUserList(data);
        });
      }
    }
  }

                /*----------------------------------------------------------
                                          Channel
                 -----------------------------------------------------------
                  > pass group data to add channel page
                  > direct to channel page
                 ----------------------------------------------------------*/

  // pass group data to add channel page
  addChannel() {
    this.userInteractionService.getGroupDetail({ groupName: this.groupName });
  }

  /**
   * direct to individual channel page. param name
   * @param name channel name
   */
  toChannel(name: string) {
    this.userInteractionService.getGroupDetail({ groupName: this.groupName });
    this.userInteractionService.getChannelDetail({ channelName: name, groupName: this.groupName });
    this.router.navigateByUrl('/channel');
  }

                /*----------------------------------------------------------
                                      Remove Group
                 ----------------------------------------------------------*/

  // remove current group
  removeGroup() {
    const data = {
      groupName: this.groupName
    };
    this.userInteractionService.removeGroup(data).subscribe(newList => {
      this.userInteractionService.groupListObservable(newList);
      this.router.navigateByUrl('/dashboard');
    });

  }

}
