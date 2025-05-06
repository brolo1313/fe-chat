import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IChat, IMessage } from '../../chat-window/models/chat.models';

@Injectable({ providedIn: 'root' })
export class StoreSelectedChatService {
  private selectedChatId = new BehaviorSubject<number | string | null>(null);
  selectedChatId$ = this.selectedChatId.asObservable();
  
  private _incomingMessage = signal<any>(null);
  public incomingMessage = this._incomingMessage.asReadonly();

  private _selectedChat = signal<any>(null);
  public selectedChat = this._selectedChat.asReadonly();
  setSelectChatId(id: number | string) {
    this.selectedChatId.next(id);
  }

  setSelectedChat(chat: IChat) {
    this._selectedChat.set(chat);
  }

  updateSelectedChat(messages: IMessage[]) {
    const currentChat = this._selectedChat();
    this._selectedChat.set({ ...currentChat, messages: [...currentChat.messages, ...messages] });
  }

  setIncomingMessage(message: any) {
    this._incomingMessage.set(message);
  }
}