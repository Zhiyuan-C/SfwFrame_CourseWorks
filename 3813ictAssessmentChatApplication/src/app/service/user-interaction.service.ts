import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observer } from '../model/common-methods';

const BACKEND_URL = 'http://localhost:3000'; // back-end url path, do not change
// http options
const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService {
  // new observer
  actionObserver = new Observer();
  groupListObserver = new Observer(); // observe full group list
  groupDetailObserver = new Observer(); // observe group detail
  channelDetailObserver = new Observer(); // observe channel detail
  channelListObserver = new Observer();  // observe channel list
  userListObserver = new Observer(); // observe user list

  constructor(private httpClient: HttpClient, private router: Router) {
    // assogn observables by making subject as obserable
    this.actionObserver.observer$ = this.actionObserver.subject.asObservable();
    this.groupListObserver.observer$ = this.groupListObserver.subject.asObservable();
    this.groupDetailObserver.observer$ = this.groupDetailObserver.subject.asObservable();
    this.channelDetailObserver.observer$ = this.channelDetailObserver.subject.asObservable();
    this.channelListObserver.observer$ = this.channelListObserver.subject.asObservable();
    this.userListObserver.observer$ = this.userListObserver.subject.asObservable();
  }

  /*================================================================================================
                                         customised observable
  ================================================================================================*/
  /** actionObservable
   * @param action any data that want to make as observable
   */
  actionObservable(action: any) {
    this.actionObserver.subject.next(action);
  }

  /** groupListObservable
   * make group list observable
   * @param groupList group list
   */
  groupListObservable(groupList: any) {
    this.groupListObserver.subject.next(groupList);
  }

  /**
   * make iser list observable
   * @param userList user list
   */
  userListObservable(userList: any) {
    this.userListObserver.subject.next(userList);
  }
  /*================================================================================================
                                            Retirve data
  ================================================================================================*/
  /**
   * get full user list
   * @return object data to be subscribed
   */
  getUserList() {
    return this.httpClient.get(BACKEND_URL + '/users');
  }

  /**
   * get full group list
   * @return object data to be subscribed
   */
  getGroupList() {
    return this.httpClient.get(BACKEND_URL + '/groupList');
  }

  /**
   * get list of channels from the group
   * @param groupName groupName: name
   * @return object data to be subscribed
   */
  getGroupUser(groupName) {
    return this.httpClient.post(BACKEND_URL + '/groupUserList', groupName, HTTP_OPTIONS);
  }

  /**
   * get list of channels from the group
   * @param group groupName: name
   * @return object data to be subscribed
   */
  getChannelList(group) {
    return this.httpClient.post(BACKEND_URL + '/channelList', group, HTTP_OPTIONS);
  }

  /**
   * get list of channels from the group
   * @param data groupName and channelName
   * @return object data to be subscribed
   */
  getChannelUser(data) {
    return this.httpClient.post(BACKEND_URL + '/channelUserList', data, HTTP_OPTIONS);
  }

  /**
   * get user detail
   * @param user username
   * @return object data to be subscribed
   */
  getUserDetail(user) {
    return this.httpClient.post(BACKEND_URL + '/userDetail', user, HTTP_OPTIONS);
  }

  /**
   * request the group detail from server, assign the data to globle observable
   * @param group grouo object that need to be send for request
   */
  getGroupDetail(group) {
    this.httpClient.post(BACKEND_URL + '/groupDetail', group, HTTP_OPTIONS).subscribe((data: any) => {
      this.groupDetailObserver.subject.next(data);
    });
  }

  /**
   * request the channel detail from server, assign the data to globle observable
   * @param channel channel object that need to be send for request
   */
  getChannelDetail(channel) {
    this.httpClient.post(BACKEND_URL + '/channelDetail', channel, HTTP_OPTIONS).subscribe((data: any) => {
      this.channelDetailObserver.subject.next(data);
    });
  }


  /*================================================================================================
                                            Add new data
  ================================================================================================*/
  /**
   * add new user
   * @param user user object send to server to add into the database
   * @return new user list as obserable
   */
  addUser(user) {
    return this.httpClient.post(BACKEND_URL + '/addUser', user, HTTP_OPTIONS);
  }

  /**
   * add new Group
   * @param group group object send to server to add into the database
   * @return new group data obserable
   */
  addGroup(group) {
    return this.httpClient.post(BACKEND_URL + '/addGroup', group, HTTP_OPTIONS);
  }

  /**
   * add new Channel
   * @param channel channel object send to server to add into the database
   * @return new channel data obserable
   */
  addChannel(channel) {
    return this.httpClient.post(BACKEND_URL + '/addChannel', channel, HTTP_OPTIONS);
  }

  /*================================================================================================
                                             Edit data
  ================================================================================================*/
  /** editRole
   * @param data data object send to server to edit the data file
   * @return new user list as obserable
   */
  editRole(data) {
    return this.httpClient.post(BACKEND_URL + '/editRole', data, HTTP_OPTIONS);
  }

  /**
   * edit user avatar
   * @param data userName: string, userAvatar: string
   * @returns result of upload avatar
   */
  editUserAvatar(data) {
    return this.httpClient.post(BACKEND_URL + '/editUserAvatar', data, HTTP_OPTIONS);
  }

  /** editGroupUserRole
   * @param data data object send to server to edit group user
   * @return result status
   */
  editGroupUser(data) {
    return this.httpClient.post(BACKEND_URL + '/editGroupUser', data, HTTP_OPTIONS);
  }

  /** editGroupUserRole
   * @param data data object send to server to add into the data file
   * @return new group data obserable
   */
  editGroupUserRole(data) {
    return this.httpClient.post(BACKEND_URL + '/editGroupUserRole', data, HTTP_OPTIONS);
  }

  /** editGroupUserRole
   * @param data object => channelName: string, newChannelUsers: any[], groupName: string
   * @return new channel user list
   */
  editChannelUser(data) {
    return this.httpClient.post(BACKEND_URL + '/editChannelUser', data, HTTP_OPTIONS);
  }

  /*================================================================================================
                                          Remove data
  ================================================================================================*/
  /** removeData
   * @param data group name send to server to remove from the data file
   */
  removeGroup(data) {
    return this.httpClient.post(BACKEND_URL + '/removeGroup', data, HTTP_OPTIONS);
  }

  /** removeChannel
   * @param data group name and channel name send to server to remove from the data file
   */
  removeChannel(data) {
    return this.httpClient.post(BACKEND_URL + '/removeChannel', data, HTTP_OPTIONS);
  }

  /** removeUsers
   * @param data user name send to server to remove from the data file
   */
  removeUser(data) {
    return this.httpClient.post(BACKEND_URL + '/removeUser', data, HTTP_OPTIONS);
  }

}
