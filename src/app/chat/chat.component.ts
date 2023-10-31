import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatService } from '../chat-service.';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @Output() closeChatEmitter = new EventEmitter()

  constructor(
    public chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.chatService.createChatConnetion();
  }

  backToHome(){
    this.closeChatEmitter.emit();
  }

  sendMessage(content: string)
  {
    this.chatService.sendMessage(content);
  }

  ngOnDestroy(): void {
    this.chatService.stopChatConnection();
  }
}
