import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, HostListener, inject, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreSelectedChatService } from '../shared/services/store-selected-chat.service';
import { ChatApiService, IMessageDeleteResponse, IMessageUpdateResponse } from '../shared/services/chat-api.service';
import { LocalStorageUserService } from '../shared/services/local-storage-user.service';
import { SocketService } from '../socket/socket.service';
import { IChat, IMessage } from './models/chat.models';
import { ContextMenuComponent } from '../shared/components/context-menu/context-menu.component';
import { ChatModalComponent } from '../shared/components/chat-modal/chat-modal.component';

@Component({
  selector: 'app-chat-window',
  imports: [
    CommonModule, UserAvatarPlaceholderComponent,
    FormsModule, ReactiveFormsModule,
    ContextMenuComponent, ChatModalComponent],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent {
  public storeSelectedChat = inject(StoreSelectedChatService);
  private apiService = inject(ChatApiService);
  private localStorageService = inject(LocalStorageUserService);
  private socketService = inject(SocketService);

  @ViewChildren('messageItem') messageItems!: QueryList<ElementRef>;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  public accessToken: string | null | undefined = null;
  public messageControl = new FormControl('', [Validators.required])

  public isMessageLoading = signal(true);

  private lastLoadedChatId: number | string | null = null;

  public contextMenuVisible = false;
  public contextMenuPosition = { x: 0, y: 0 };

  public modalVisible = false;
  public modalMode: 'create' | 'delete' | 'edit' = 'create';

  public localSelectedChatMessage!: IMessage;
  public chat = this.storeSelectedChat.selectedChat()

  @HostListener('document:click')
  hideContextMenu() {
    this.contextMenuVisible = false;
  }
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
  }

  ngAfterViewInit() {
    this.messageItems.changes.subscribe(() => {
      const containerEl = this.chatContainer.nativeElement;
      const containerHeight = containerEl.clientHeight;

      const totalMessagesHeight = this.messageItems.reduce((total, item) => {
        return total + item.nativeElement.offsetHeight;
      }, 0);


      if (totalMessagesHeight > containerHeight) {
        this.scrollToBottom();
      }
    });
  }

  sendMessage(msg: string) {
    if (msg.trim()) {
      this.socketService.sendMessage({
        chatId: this.storeSelectedChat.selectedChat()!?.id,
        text: msg,
      });
      this.messageControl.reset();
    }
  }

  onKeyDownEvent() {
    const msg = this.messageFC;
    this.sendMessage(msg!);
  }

  public editChatContextMenu() {
    this.contextMenuVisible = false;
    this.showEditModal();
  }

  public deleteChatContextMenu() {
    this.contextMenuVisible = false;
    this.showDeleteModal();
  }

  public handleConfirm(data: { id: string, message: string }): void {
    this.modalVisible = false;

    switch (this.modalMode) {
      case 'edit':
        if (data) {
          this.updateMessage(data.id, data.message);
        }
        break;

      case 'delete':
        if (data) {
          this.deleteMessage(data?.id);
        }
        break;
    }
  }

  private updateMessage(id: string | number, message: string): void {
    this.apiService.updateMessage(id, message).subscribe({
      next: (data: IMessageUpdateResponse) => this.storeSelectedChat.findChatByIdAndUpdateMessage(data),
      error: (err: any) => console.error('Update failed', err)
    });
  }

  private deleteMessage(id: string | number): void {
    this.apiService.deleteMessage(id).subscribe({
      next: (data: IMessageDeleteResponse) => this.storeSelectedChat.findChatByIdAndDeleteMessage(data),
      error: (err: any) => console.error('Delete failed', err)
    });
  }

  public onRightClick(event: MouseEvent, message: IMessage) {
    event.preventDefault();
    this.localSelectedChatMessage = message;
    this.contextMenuPosition = {
      x: event.clientX,
      y: event.clientY
    };
    this.contextMenuVisible = true;
  }


  public showEditModal() {
    this.modalMode = 'edit';
    this.modalVisible = true;
  }

  public showDeleteModal() {
    this.modalMode = 'delete';
    this.modalVisible = true;

  }
  private scrollToBottom(): void {
    const container = this.chatContainer?.nativeElement;
    container.scrollTo({
      top: container.scrollHeight + 20,
      behavior: 'auto'
    });
  }
}
