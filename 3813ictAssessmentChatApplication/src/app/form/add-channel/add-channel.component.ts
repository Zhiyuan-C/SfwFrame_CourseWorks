import { Component, OnInit } from '@angular/core';
import { UserInteractionService } from '../../service/user-interaction.service';
import { UserAuthenticationService } from '../../service/user-authentication.service';
import { Channel } from '../../model/collection';
import { ErrorAlert } from '../../model/common-methods';
declare const $: any; // jquery

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css']
})
export class AddChannelComponent implements OnInit {
  /*******************************************************************************
                                  Properties
  -------------------------------------------------------------------------------
  ==============================================================================*/

  // initialise properties for displayn gmodel
  name = ''; // channel name
  groupName = ''; // group name
  groupChannelList = []; // channle list that in the group
  // alert
  alert = new ErrorAlert();

  /*******************************************************************************
                                      Display
  -------------------------------------------------------------------------------
  ==============================================================================*/

  constructor(private userInteract: UserInteractionService, private userAuth: UserAuthenticationService) {
    // get current group detail
    this.userInteract.groupDetailObserver.observer$.subscribe((data) => {
      this.groupName = data.groupName;
      this.groupChannelList = data.groupChannel;
    });
  }

  ngOnInit() {
  }

  // reset input and alert when user press cancel
  reset() {
    // get update for group detail page
    this.userInteract.getGroupDetail({ groupName: this.groupName });
    this.name = '';
    this.alert.closeAlert();
    $('#channelModal').modal('hide');
  }

  /*******************************************************************************
                                    Database
  -------------------------------------------------------------------------------
  ==============================================================================*/

  // have new channel object and send to server to add into channel data file
  addChannel() {
    // check if the name is empty, if not empty proceed, else error
    if (this.name === '') {
      this.alert.showAlert('Empty field: channel name should not be empty');
    } else {
      // check if the name contains any special characters
      const nameRegex = new RegExp('[^a-zA-Z0-9 ]');
      const specialCharacters = nameRegex.test(this.name);
      if (specialCharacters) {
        this.alert.showAlert('Channel name should only contain letters, numbers and spaces');
      } else {
        // initialise channel object
        this.alert.closeAlert();
        // initialise channel object
        const newChannel = new Channel(this.name, this.groupName);
        const groupChannelList = this.groupChannelList;
        groupChannelList.push(this.name);

        // send object to server and subscribe response
        this.userInteract.addChannel([newChannel, groupChannelList]).subscribe((data: any) => {
          if (!data.status) {
            this.alert.showAlert(data.msg);
            groupChannelList.pop();
          } else {
            // get update for group detail page
            this.userInteract.getGroupDetail({ groupName: this.groupName });
            // get update for side nav
            this.userInteract.getGroupList().subscribe((groupDataList) => {
              this.userInteract.groupListObservable(groupDataList);
            });
            this.name = '';
            this.alert.closeAlert();
            $('#channelModal').modal('hide');
          }
        });
      }
    }
  }


}
