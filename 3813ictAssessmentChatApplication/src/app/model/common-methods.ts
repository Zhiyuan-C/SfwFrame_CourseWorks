import { Observable, Subject } from 'rxjs';

// Obserber object
export class Observer {
  observer$: Observable<any>;
  subject = new Subject<any>();
}

// ErrorAlert, in charge of display the alert or not
export class ErrorAlert {
  show = false;
  msg = '';

/**
 * display alert
 * @param message error message for display
 */
showAlert(message: string) {
    this.show = true;
    this.msg = message;
  }

  /**
   * reset alert
   */
  closeAlert() {
    this.show = false;
    this.msg = '';
  }
}

// message structure for display in the channel
export class Message {
  // properties
  announcement;
  userName;
  userAvatar;
  message;
  image;
  imagePath;
  selfMessage;
  // set value to the properties
  constructor(
    announcement: boolean, userName: string, userAvatar: string,
    message: string, image: boolean, imagePath: string, selfMessage: boolean ) {
    this.announcement = announcement;
    this.userName = userName;
    this.userAvatar = userAvatar;
    this.message = message;
    this.image = image;
    this.imagePath = imagePath;
    this.selfMessage = selfMessage;

  }
}
