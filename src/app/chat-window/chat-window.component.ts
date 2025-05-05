import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreSelectedChatService } from '../shared/services/store-selected-chat.service';
import { ChatApiService } from '../shared/services/chat-api.service';
import { LocalStorageUserService } from '../shared/services/local-storage-user.service';
import { SocketService } from '../socket/socket.service';
import { IChat } from './models/chat.models';

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

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  public accessToken: string | null | undefined = null;
  public messageControl = new FormControl('', [Validators.required])

  public selectedChat!: IChat;

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
      if (id) {
        this.apiService.getMessagesByChatId(id).subscribe((response: any) => {
          this.storeSelectedChat.setSelectedChat(response);
        });
      }
    });
  }

  sendMessage(msg: string) {
    if (msg.trim()) {
      this.socketService.sendMessage({
        chatId: this.selectedChat?.chatId,
        text: msg,
      });
      this.messageControl.reset();
      this.scrollToBottom();
    }
  }

  onKeyDownEvent() {
    const msg = this.messageFC;
    this.sendMessage(msg!);
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const container = this.chatContainer?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
