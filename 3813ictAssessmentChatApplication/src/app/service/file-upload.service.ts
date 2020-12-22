import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const BACKEND_URL = 'http://localhost:3000'; // back-end url path, do not change
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor( private httpClient: HttpClient ) { }
  /**
   * upload user avatar
   * @param file image file send to server for upload
   * @returns result of upload avatar path
   */
  uploadUserAvatar(file) {
    return this.httpClient.post(BACKEND_URL + '/uploadUserAvatar', file);
  }

  /**
   * upload chat image
   * @param file image file send to server for upload
   * @returns result of upload chat image path
   */
  uploadChatImage(file) {
    return this.httpClient.post(BACKEND_URL + '/uploadChatImage', file);
  }
}
