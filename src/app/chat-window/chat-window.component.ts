import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreSelectedChatService } from '../shared/services/store-selected-chat.service';
import { ChatApiService } from '../shared/services/chat-api.service';

@Component({
  selector: 'app-chat-window',
  imports: [CommonModule, UserAvatarPlaceholderComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss'
})
export class ChatWindowComponent {
  storeSelectedChat = inject(StoreSelectedChatService);
  apiService = inject(ChatApiService);

  public messageControl = new FormControl('', [Validators.required])

  public selectedChat: any = null;

  get messageFC() {
    return this.messageControl.value;
  }

  ngOnInit() {
    this.storeSelectedChat.selectedChatId$.subscribe((id) => {
      console.log('Selected chat ID:', id);
      if (id) {
        this.selectedChat = this.apiService.getChatById(id);
      }
    });
  }

  sendMessage() {
    const msg = this.messageFC;
    this.messageControl.reset();
    console.log('Sending message:', msg);
  }

  onKeyDownEvent(event: any) {
    console.log('event', event);
    const msg = this.messageFC;
    this.messageControl.reset();
    console.log('Sending message:', msg);
  }



}
