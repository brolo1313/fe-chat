import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreSelectedChatService } from '../shared/services/store-selected-chat.service';
import { ChatApiService } from '../shared/services/chat-api.service';
import { LocalStorageUserService } from '../shared/services/local-storage-user.service';
import { Socket } from 'socket.io-client';
import { SocketService } from '../socket/socket.service';

@Component({
  selector: 'app-chat-window',
  imports: [CommonModule, UserAvatarPlaceholderComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent {
  private storeSelectedChat = inject(StoreSelectedChatService);
  private apiService = inject(ChatApiService);
  private localStorageService = inject(LocalStorageUserService);
  private socketService = inject(SocketService);

  public accessToken: string | null | undefined = null;
  public messageControl = new FormControl('', [Validators.required])

  public selectedChat: any = null;



  get messageFC() {
    return this.messageControl.value;
  }

  constructor() {
    effect(() => {
      this.accessToken = this.localStorageService.userSettings()?.accessToken;
      this.selectedChat = this.storeSelectedChat.selectedChat();
    });
  }

  ngOnInit() {
    this.storeSelectedChat.selectedChatId$.subscribe((id) => {
      console.log('Selected chat ID:', id);
      if (id) {
        this.apiService.getMessagesByChatId(id).subscribe((response: any) => {
          console.log('Messages for chat ID', id, ':', response);
          this.storeSelectedChat.setSelectedChat(response);
        });
      }
    });
  }

  sendMessage() {
    const msg = this.messageFC;
    console.log('this.selectedChat.id', this.selectedChat.id);
    this.socketService.sendMessage({
      chatId: this.selectedChat.chatId,
      text: msg,
    });

    this.messageControl.reset();
  }

  onKeyDownEvent(event: any) {
    console.log('event', event);
    const msg = this.messageFC;
    this.messageControl.reset();
    console.log('Sending message:', msg);
  }



}
