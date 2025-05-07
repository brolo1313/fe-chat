import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreSelectedChatService } from '../shared/services/store-selected-chat.service';
import { ChatApiService } from '../shared/services/chat-api.service';
import { LocalStorageUserService } from '../shared/services/local-storage-user.service';
import { SocketService } from '../socket/socket.service';
import { IChat, IMessage } from './models/chat.models';

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

  public isMessageLoading = signal(true);

  public selectedChatLocalSignal = signal<IChat | any>(null);
  private lastLoadedChatId: number | string | null = null;
  
  public trackByFn(index: number, messages: IMessage): number | string {
    return messages.id;
  }
  get messageFC() {
    return this.messageControl.value;
  }

  constructor() {
    effect(() => {
      this.accessToken = this.localStorageService.userSettings()?.accessToken;
    });

    effect(() => {
      const chat = this.storeSelectedChat.selectedChat();
      if (!chat || chat.id === this.lastLoadedChatId) return;

      this.isMessageLoading.set(true);
      this.apiService.getMessagesByChatId(chat.id).subscribe({
        next: (response: IChat) => {
          this.lastLoadedChatId = chat.id;
          this.storeSelectedChat.setSelectedChat(response);
          this.isMessageLoading.set(false);
        },
        error: (err: any) => {
          console.error('Failed to load messages:', err);
          this.isMessageLoading.set(false);
        }
      });
    });

    effect(() => {
      this.selectedChatLocalSignal.set(this.storeSelectedChat.selectedChat());
    });
  }

  sendMessage(msg: string) {
    if (msg.trim()) {
      this.socketService.sendMessage({
        chatId: this.selectedChatLocalSignal()?.id,
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
