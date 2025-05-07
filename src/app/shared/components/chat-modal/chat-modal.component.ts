import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMessage } from '../../../chat-window/models/chat.models';

type Mode = 'create' | 'edit' | 'delete';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss']
})
export class ChatModalComponent implements OnInit {
  @Input() mode: Mode = 'create';
  @Input() isForMessage = false;
  @Input() chat: { id?: number | string; firstName?: string; lastName?: string } | null = null;
  @Input() messageData!: IMessage;

  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  public firstName = new FormControl('', Validators.required);
  public lastName = new FormControl('', Validators.required);
  public message = new FormControl('');

  ngOnInit(): void {
    if (this.isForMessage) {
      this.initMessageForm();
    } else {
      this.initChatForm();
    }
  }

  private initChatForm(): void {
    if (this.mode === 'edit' && this.chat) {
      this.firstName.setValue(this.chat.firstName || '');
      this.lastName.setValue(this.chat.lastName || '');
    }
  }

  private initMessageForm(): void {
    if (this.mode === 'edit' && this.messageData) {
      this.message.setValue(this.messageData.text || '');
    }
  }

  onConfirm(): void {
    const payload = this.buildConfirmPayload();
    if (payload) {
      this.confirm.emit(payload);
    }
  }

  private buildConfirmPayload(): any | null {
    if (this.isForMessage) {
      return this.buildMessagePayload();
    } else {
      return this.buildChatPayload();
    }
  }

  private buildChatPayload(): any | null {
    const { mode, chat, firstName, lastName } = this;
    switch (mode) {
      case 'create':
        return {
          firstName: firstName.value,
          lastName: lastName.value
        };
      case 'edit':
        return {
          id: chat?.id,
          firstName: firstName.value,
          lastName: lastName.value
        };
      case 'delete':
        return { id: chat?.id };
      default:
        return null;
    }
  }

  private buildMessagePayload(): any | null {
    const { mode, messageData, message } = this;
    switch (mode) {
      case 'edit':
        return {
          id: messageData?.id,
          message: message.value
        };
      case 'delete':
        return { id: messageData?.id };
      default:
        return null;
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
