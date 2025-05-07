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

  findChatByIdAndUpdateMessage(data: IMessage): IChat | undefined {
    const chatToUpdate = this._allChats().find(chat => chat.id === data.chat);
    if (!chatToUpdate) return;
    chatToUpdate?.messages.push(data);
    chatToUpdate!.lastMessage = data;

    this._allChats.set(this._allChats().map(chat => chat.id === data.chat ? chatToUpdate : chat));
    return
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

  findCHatByIdAndDeleteMessage(data: { success: boolean, messageData: { chatId: string, messageId: string, text: string, isLast: boolean } }): void {
    const { success, messageData } = data;
    const messageId = messageData.messageId;
    const chatId = messageData.chatId;
    const chat = this._selectedChat();

    if (!chat || chat.id !== chatId) return;

    const updatedMessages = chat.messages.filter(
      msg => msg.id?.toString() !== messageId
    );

    const updatedChat = { ...chat, messages: updatedMessages };
    this._selectedChat.set(updatedChat);

    if (messageData.isLast) {
      this._filteredChats.update(chats => chats.map(chat => chat.id === chatId ? { ...chat, lastMessage: updatedChat.messages[chat.messages.length - 2] } : chat));
    }
  }
}
