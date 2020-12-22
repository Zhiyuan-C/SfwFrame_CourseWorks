import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { UserInteractionService } from '../service/user-interaction.service';
import { SocketService } from '../service/socket.service';
import { FileUploadService } from '../service/file-upload.service';
import { ChatData, ChannelUser } from '../model/collection';
import { ErrorAlert } from '../model/common-methods';
import { Message } from '../model/common-methods';
import { Router } from '@angular/router';

declare const $: any; // jquery
const AVATAR_PATH = 'http://localhost:3000/userAvatar?fileName='; // avatar path to display user avatar
const CHAT_IMAGE_PATH = 'http://localhost:3000/chat/message?fileName='; // image path to display chat image
@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit, OnDestroy {

  /*******************************************************************************
                                  Properties
  -------------------------------------------------------------------------------
  ==============================================================================*/

  userList = []; // list of current channel users
  userLiNotInCh = []; // list of current group users not in the channel

  // properties for store current group and channel data
  groupName = '';
  channelName = '';
  groupUsers = [];

  // properties for live chat
  chatInput = ''; // message input field data
  messages = []; // list of messages for display
  image = false; // determine if user upload image
  imageFile = null; // image file send to server
  imagePreview = ''; // image preview path
  hasHistory = false; // if the chat has history
  historyMessages = []; // list of history messages
  selfMessage = false; // if the message is send by self

  // edit mode for edit user.
  editMode = false;
  // alert
  alert = new ErrorAlert();
  chatAlert = new ErrorAlert();
  /*
  Permmission for edit user in the channel, and remove channel
  Level 0 - Remove Channel, add user & remove user from channel
    Super Admin, Group Admin

  Lebel 1 - Add & Remove User from channel
    Super Admin, Group Admin, Group Assis
  */
  lv1Permission = false;
  lv0Permission = false;


  /*******************************************************************************
                                      Display
  -------------------------------------------------------------------------------
  ==============================================================================*/
  constructor(
    private userInteractionService: UserInteractionService,
    private router: Router, private socketService: SocketService,
    private fileUploadService: FileUploadService) {
  }

  /**
   * User join the channel
   *  > get channel detail to display
   *  > get current user permisiion level
   *  > connect to socket
   *  > observe the message and announcement
   */
  ngOnInit() {
    console.log('ngOnInit');
    // get current user permisiion level
    const superAdmin = (localStorage.getItem('superAdmin') === 'true') ? true : false;
    const groupAdmin = (localStorage.getItem('groupAdmin') === 'true') ? true : false;
    this.lv0Permission = (superAdmin || groupAdmin) ? true : false;
    this.lv1Permission = (superAdmin || groupAdmin) ? true : false;
    // connect to socket
    this.socketService.socketInit();

    // display channel detail
    this.displayChannelDetail();

    // get message history
    this.socketService.historyObserver().subscribe((histories) => {
      this.historyMessages = [];
      if (histories !== null) {
        this.hasHistory = true;
        histories.forEach(history => {
          this.historyMessages.unshift(this.setMessage(history));
        });
      } else {
        this.hasHistory = false;
        this.historyMessages = [];
      }
      console.log(this.historyMessages);
    });

    // observe messages and announcements
    this.socketService.messageObserver().subscribe((data) => {
      this.messages.unshift(this.setMessage(data));
    });

    // get announcement: user enter room, left room
    this.socketService.announcementObserver().subscribe((message) => {
      const newMessage = new Message(true, '', '', message, false, '', false);
      this.messages.unshift(newMessage);
    });
  }

  // User left the channel, disconnect the socket
  ngOnDestroy(): void {
    // dissconnect channel
    this.socketService.closeSocket();
  }

  /**
   * set the message structure to be included this.messages for display
   * @param data message data emit by the socket from server
   * @returns reformatted message for display
   */
  setMessage(data: any): Message {
    let avatar = data.userAvatar ;
    let chatImage = data.imagePath;
    if (avatar === '' ) {
      avatar = 'assets/logo.PNG';
    } else {
      avatar = AVATAR_PATH + avatar;
    }
    if (data.image) {
      chatImage = CHAT_IMAGE_PATH + chatImage;
    }
    if (data.userName === localStorage.getItem('userName')) {
      this.selfMessage = true;
    } else {
      this.selfMessage = false;
    }
    const newMessage = new Message(
      false, data.userName, avatar, data.message,
      data.image, chatImage, this.selfMessage);
    return newMessage;
  }

  // display channel detail
  displayChannelDetail() {
    // get user list that are in the channel
    this.userInteractionService.channelDetailObserver.observer$.subscribe((data) => {
      this.channelName = data.channelName;
      this.groupName = data.groupBelong;
      this.userInteractionService
          .getChannelUser({groupName: data.groupBelong, channelName: data.channelName})
          .subscribe((channelUser: any[]) => {
        this.generateUserList(channelUser);
      });
      this.userInteractionService.getGroupUser({groupName: data.groupBelong}).subscribe((groupUserData: any) => {
        // groupUsers for compare with channel users and get list of users that are not in channel
        this.groupUsers = groupUserData;
        // check if current user is group assist and update permission
        if (groupUserData.length !== 0) {
          groupUserData.forEach(item => {
            if (localStorage.getItem('userName') === item.userName) {
              if (item.groupAssist) {
                this.lv1Permission = true;
              }
            }
          });
        }
      });
      // pass current channel information to socket, for store chat history in database
      this.socketService.sendChannelDetail({
        channelName: data.channelName,
        groupBelong: data.groupBelong,
        userName: localStorage.getItem('userName')
      });
    });
  }

  /**
   * restructure the this.userList to be used for display and edit
   * @param userArray list of channel users
   */
  generateUserList(userArray: any[]) {
    this.userList = [];
    userArray.forEach(user => {
      let path = 'assets/logo.PNG';
      if (user.userAvatar !== '') {
        path = AVATAR_PATH + user.userAvatar;
      }
      this.userList.push({
        userName: user.userName, selected: false, userAvatar: user.userAvatar,
        fullAvatarPath: path, groupAssist: user.groupAssist});
    });
  }

  // get list of user who are not in this channel
  getUserLsNotInCh() {
    // compare channel users with group users, remove user that already in the channel
    this.userList.forEach(user => {
      const i = this.groupUsers.findIndex(groupUser => ((groupUser.userName === user.userName)));
      if (i > -1) {
        this.groupUsers.splice(i, 1);
      }
    });
    // update the userLiNotInCh
    this.userLiNotInCh = [];
    this.groupUsers.forEach(user => {
      this.userLiNotInCh.push({ userName: user.userName, selected: false,  userAvatar: user.userAvatar, groupAssist: user.groupAssist});
    });
  }

  /*******************************************************************************
                        Other display according to user action
  -------------------------------------------------------------------------------
  ==============================================================================*/
  // edit mode become true
  editUser() {
    this.editMode = true;
  }

  // reset user input and alert
  cancel() {
    this.userLiNotInCh.forEach(item => {
      item.selected = false;
    });
    this.editMode = false;
    this.alert.closeAlert();
  }

  // reset user input and close modal for add user
  close() {
    this.userLiNotInCh.forEach(item => {
      item.selected = false;
    });
    $('#addUserChModal').modal('hide');
    this.alert.closeAlert();
  }

  // redirect to grouppage
  backToGroup() {
    // call group observer to display group page
    this.userInteractionService.getGroupDetail({ groupName: this.groupName });
    this.router.navigateByUrl('/group');
  }

  /*******************************************************************************
                                    Database
  -------------------------------------------------------------------------------
  ==============================================================================*/

  // remove current channel
  removeChannel() {
    const data = {
      groupName: this.groupName,
      channelName: this.channelName
    };
    this.userInteractionService.removeChannel(data).subscribe(result => {
      this.userInteractionService.getGroupDetail({ groupName: this.groupName });
      this.router.navigateByUrl('/group');
    });
  }

  /**
   * add user or remove user from channel
   * @param type either add or remove
   */
  addOrRemoveUser(type: string) {
    // initialise data to be send to server
    const channelUserData = {
      channelName: this.channelName,
      groupName: this.groupName,
      addedNewUsers: [],
      removedUsers: []
    };
    let editUser = false;

    if (type === 'add') {
      // add new users
      this.userLiNotInCh.forEach(user => {
        if (user.selected) {
          editUser = true;
          const newUser = new ChannelUser(this.groupName, this.channelName, user.userName, user.userAvatar, user.groupAssist);
          channelUserData.addedNewUsers.push(newUser);
        }
      });
    } else {
      // add removed users
      this.userList.forEach(user => {
        if (user.selected) {
          editUser = true;
          const newUser = new ChannelUser(this.groupName, this.channelName, user.userName, user.userAvatar, user.groupAssist);
          channelUserData.removedUsers.push(newUser);
        }
      });
    }
    // if user has been selected, send data to server
    if (editUser) {
      this.alert.closeAlert();
      this.userInteractionService.editChannelUser(channelUserData).subscribe((data: any) => {
        editUser = false;
        this.editMode = false;
        this.generateUserList(data);
        $('#addUserChModal').modal('hide');
      });
    } else {
      this.alert.showAlert('Please select at least one user to perform action');
    }
  }

  /*******************************************************************************
                                     Image
  -------------------------------------------------------------------------------
  ==============================================================================*/

  /**
   * Get image file data, setup for preview and store in this.imageFile to send to server
   * @param files image file data slected by user
   */
  imageSelected(files: any) {
    this.image = true;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    };
    reader.readAsDataURL(files[0]);
    this.imageFile = files[0];
  }

  // reset properties when user cancel upload image
  cancelImageUpload() {
    this.image = false;
    this.imageFile = null;
  }

  /*******************************************************************************
                                     Socket
  -------------------------------------------------------------------------------
  ==============================================================================*/

  // Send meesage to socket
  sendMsg() {
    const finishUpload = false;
    // if is image
    if (this.image) {
      this.chatAlert.closeAlert();
      const form = new FormData();
      form.append('file', this.imageFile, this.imageFile.name);
      // upload file
      this.fileUploadService.uploadChatImage(form).subscribe((data: any) => {
        if (data.status) {
          this.sendToSocket('imageMessage', data.msg);
        }
      });
    } else if (this.chatInput) {
      this.chatAlert.closeAlert();
      this.sendToSocket('normalMessage', '');
    } else {
      this.chatAlert.showAlert('Atempt to send empty message, please enter message');
    }

  }

  /**
   * send message to socket type: normalMessage or imageMessage
   * @param type stirng, if message: normalMessage, if image: imageMessage
   * @param imageFilePath string, empty if no image, else the image path uploaded in the server
   */
  sendToSocket(type: string, imageFilePath: string) {
    this.userInteractionService.getUserDetail({userName: localStorage.getItem('userName')}).subscribe((data: any) => {
      // initialise chat data to be send
      const chatData = new ChatData(this.channelName, this.groupName, data.userName, data.userAvatar, '', false, '');
      if (type === 'normalMessage') {
        chatData.message = this.chatInput;
      } else {
        chatData.image = true;
        chatData.imagePath = imageFilePath;
      }
      this.socketService.emitMsg({msg: chatData});
      this.chatInput = '';
      this.image = false;
      this.imageFile = null;
    });
  }

}
