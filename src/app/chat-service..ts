import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from './models/user';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Message } from './models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  myUserName: string = '';
  private chatConnection?: HubConnection;
  onlineusers: string [] = [];
  messages: Message [] = [];

  constructor(private httpClient: HttpClient) { }

  registerUser(user: User) {
    return this.httpClient.post(`${environment.apiUrl}api/chat/register-user`, user, {responseType:'text'});
  }

  createChatConnetion() {
    this.chatConnection = new HubConnectionBuilder()
    .withUrl(`${environment.apiUrl}hubs/chat`).withAutomaticReconnect().build();

    this.chatConnection.start().catch(error => {
      console.log(error);
    });

    this.chatConnection.on('UserConnected', () => {
      this.addUserConnectionId();
    });

    this.chatConnection.on('OnLineUsers', (onlineusers) => {
      this.onlineusers = [...onlineusers];
    });

    this.chatConnection.on('NewMessage', (newMessage: Message) => {
      this.messages = [...this.messages, newMessage];
    });
  }

  stopChatConnection(){
    this.chatConnection?.stop().catch(error => console.log(error));
  }

  async addUserConnectionId() {
    return this.chatConnection?.invoke('AddUserConnectionId', this.myUserName)
    .catch(error => console.log(error));
  }

  async sendMessage(content: string){
    const message: Message = {
      from: this.myUserName,
      content
    };

    return this.chatConnection?.invoke("ReceivedMessage", message)
    .catch(error => console.log(error));
  }
}
