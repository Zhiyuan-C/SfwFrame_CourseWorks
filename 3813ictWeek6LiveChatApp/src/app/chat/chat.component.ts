import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chatInput: string = "";
  messages: string[] = [];

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.ioConnectionInit()
  }
  
  // initialise socket connection & subscribe to change
  ioConnectionInit(){
    this.socketService.socketInit();
    this.socketService.onMsg().subscribe((message)=>{
      this.messages.push(message);
    });
    
  }

  // emit message to the server
  sendMsg(){
    if (this.chatInput){
      this.socketService.emitMsg(this.chatInput);
      this.chatInput = null;
    } else {
      console.log('no message');
    }
    
  }

}
