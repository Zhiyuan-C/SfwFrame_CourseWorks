import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthenticationService } from './service/user-authentication.service';
import { UserInteractionService } from './service/user-interaction.service';
import { FileUploadService } from './service/file-upload.service';
declare const $: any; // jquery
const AVATAR_PATH = 'http://localhost:3000/userAvatar?fileName='; // avatar path to display user avatar

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  /*******************************************************************************
                                  Properties
  -------------------------------------------------------------------------------
  ==============================================================================*/

  loggedIn = false;
  // display badge for role
  saBadge = ''; // badge for super admin
  gaBadge = ''; // badge for group admin

  userData = {};
  groupData = []; // display list of groups and channels the user have

  userAvatar = 'assets/logo.PNG'; // default avatar path for user
  showConfirm = false; // confirm to upload the image as avatar
  uploading = false; // show loading spin if is true
  imageFile = null; // image file send to server

  /*******************************************************************************
                                      Display
  -------------------------------------------------------------------------------
  ==============================================================================*/
  constructor(private router: Router,
              private userAuth: UserAuthenticationService,
              private userInteractionService: UserInteractionService,
              private fileUploadService: FileUploadService) {
                // display navigation after login
                this.userAuth.userStatus$.subscribe((result) => {
                  this.loginSuccess();
                  this.displayNav(result);
                  console.log(result);
                });
                // update side nav when group created
                this.userInteractionService.groupListObserver.observer$.subscribe(data => {
                  this.getGroupList(data);
                });
 }

  // assign data to the property for display
  ngOnInit() {
    // display view if user already login (referesh page)
    if (localStorage.getItem('userName') != null) {
      this.loginSuccess();
      this.userInteractionService.getUserDetail({userName: localStorage.getItem('userName')}).subscribe(data => {
        this.displayNav(data);
      });
    } else {
      this.loginUnsuccess();
    }
  }

  /**
   * set values to the property for display the side nav bar
   * @param userData user data retrieved from database
   */
  displayNav(userData: any) {
    // update view
    this.userData = userData;
    this.saBadge = (userData.superAdmin) ? 'Super Admin' : '';
    this.gaBadge = (userData.groupAdmin) ? 'Group Admin' : '';
    // user avatar
    if (userData.userAvatar !== '' ) {
      this.userAvatar = AVATAR_PATH + userData.userAvatar;
    } else {
      this.userAvatar = 'assets/logo.PNG';
    }
    // get group and channel list
    this.userInteractionService.getGroupList().subscribe((groupData: any) => {
      // get full group list if user is super admin or group admin
      if (userData.superAdmin || userData.groupAdmin) {
        this.getGroupList(groupData);
      } else { // if normal user, only display the group they are in
        const newGroupData = [];
        userData.groupList.forEach(userGroup => {
          groupData.forEach(data => {
            if (userGroup === data.groupName) {
              newGroupData.push(data);
            }
          });
        });
        this.getGroupList(newGroupData);
      }
    });
  }

  /**
   * rename the group name, change white space to -, for work with bootstrap.
   * @param groupArray user data object for comparing
   */
  getGroupList(groupArray: any[]) {
    groupArray.forEach((group) => {
      group.groupName = group.groupName.split(' ').join('-');
    });
    this.groupData = groupArray;
  }

  // redirect to dashboard if user logged in
  loginSuccess() {
    this.loggedIn = true;
    this.router.navigateByUrl('/dashboard');
  }

  // redirect to login page if user not logged in
  loginUnsuccess() {
    this.loggedIn = false;
    this.userData = {};
    this.groupData = [];
    this.router.navigateByUrl('/login');
  }

  // logout user, clear local storage data, redirect user back to login page
  logout() {
    localStorage.clear();
    this.loginUnsuccess();
  }

  /**
   * Direct to group detail page
   * @param name group name
   */
  displayGroupDetail(name: string) {
    name = name.split('-').join(' ');
    this.userInteractionService.getGroupDetail({ groupName: name });
    this.router.navigateByUrl('/group');
  }

  /**
   *  Direct to channel detail page
   * @param gpName group name
   * @param chName channel name
   */
  toChannel(gpName: string, chName: string) {
    gpName = gpName.split('-').join(' ');
    this.userInteractionService.getChannelDetail({ channelName: chName, groupName: gpName });
    this.userInteractionService.getGroupDetail({ groupName: gpName });
    this.router.navigateByUrl('/channel');
  }


  /*******************************************************************************
                                     Image
  -------------------------------------------------------------------------------
  ==============================================================================*/

  /**
   * select avatar image and display preview
   * @param files image file data
   */
  changeAvatar(files) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.userAvatar = event.target.result;
    };
    reader.readAsDataURL(files[0]);
    this.showConfirm = true;
    this.imageFile = files[0];
  }

  // upload the image to server, and save file path to database, display new avatar
  upload() {
    this.showConfirm = false;
    this.uploading = true;
    // create new formData with the image file to send to server
    const form = new FormData();
    form.append('file', this.imageFile, this.imageFile.name);
    // upload file
    this.fileUploadService.uploadUserAvatar(form).subscribe((data: any) => {
      if (data.status) {
        const newData = {
          userName: localStorage.getItem('userName'),
          userAvatar: data.msg
        };
        // update database and siplay new user avatar
        this.userInteractionService.editUserAvatar(newData).subscribe((result: any) => {
          this.uploading = false;
          this.userAvatar = AVATAR_PATH + result.userAvatar;
        });
      }
    });
  }

}
