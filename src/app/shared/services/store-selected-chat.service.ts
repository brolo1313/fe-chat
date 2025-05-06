import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IChat, IMessage } from '../../chat-window/models/chat.models';

@Injectable({ providedIn: 'root' })
export class StoreSelectedChatService {
  private _allChats = signal<IChat[]>([]);
  public allChats = this._allChats.asReadonly();

  private _filteredChats = signal<IChat[]>([]);
  public filteredChats = this._filteredChats.asReadonly();

  private _selectedChat = signal<IChat | null>(null);
  public selectedChat = this._selectedChat.asReadonly();

  setAllChats(chats: IChat[]): void {
    this._allChats.set(chats);
    this._filteredChats.set(chats);
  }

  setFilteredChats(chats: IChat[]): void {
    this._filteredChats.set(chats);
  }

  setSelectedChat(chat: IChat | null): void {
    this._selectedChat.set(chat);
  }

  updateSelectedChat(messages: IMessage) {
    const currentChat = this._selectedChat();

    const updatedChat: IChat | any = {
      ...currentChat,
      messages: [...currentChat!.messages, messages],
      lastMessage: messages
    };
    
    if (currentChat) {
      this._selectedChat.set({ ...currentChat, messages: [...currentChat.messages, messages], lastMessage: messages });

      this._filteredChats.update(chats => this.updateChatInList(chats, updatedChat));
      this._allChats.update(chats => this.updateChatInList(chats, updatedChat));
    }
  }

  private updateChatInList(list: IChat[], updatedChat: IChat): IChat[] {
    return list.map(chat =>
      chat.id === updatedChat.id ? { ...chat, ...updatedChat } : chat
    );
  }
}
