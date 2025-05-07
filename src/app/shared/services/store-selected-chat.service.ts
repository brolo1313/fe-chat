import { Injectable, signal } from '@angular/core';
import { IChat, IMessage } from '../../chat-window/models/chat.models';
import { IMessageDeleteResponse, IMessageUpdateResponse } from './chat-api.service';

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

  private updateChatsInListById(updatedChat: IChat): void {
    this._allChats.update(chats => this.updateChatInList(chats, updatedChat));
    this._filteredChats.update(chats => this.updateChatInList(chats, updatedChat));
  }

  private updateChatInList(list: IChat[], updatedChat: IChat): IChat[] {
    return list.map(chat => chat.id === updatedChat.id ? { ...chat, ...updatedChat } : chat);
  }

  private setSelectedChatMessages(messages: IMessage[], lastMessage?: IMessage): void {
    const currentChat = this._selectedChat();
    if (!currentChat) return;

    this._selectedChat.set({
      ...currentChat,
      messages,
      lastMessage: lastMessage ?? currentChat.lastMessage,
    });
  }

  addMessageToChat(message: IMessage): void {
    const chat = this._allChats().find(chat => chat.id === message.chat);
    if (!chat) return;

    const updatedChat: IChat = {
      ...chat,
      messages: [...chat.messages, message],
      lastMessage: message,
    };

    this.updateChatsInListById(updatedChat);
  }

  updateSelectedChat(message: IMessage): void {
    const currentChat = this._selectedChat();
    if (!currentChat) return;

    const updatedChat: IChat = {
      ...currentChat,
      messages: [...currentChat.messages, message],
      lastMessage: message,
    };

    this._selectedChat.set(updatedChat);
    this.updateChatsInListById(updatedChat);
  }

  findChatByIdAndDeleteMessage(data: IMessageDeleteResponse): void {
    const { messageData } = data;
    const { messageId, chatId, isLast } = messageData;

    const chat = this._selectedChat();
    if (!chat || chat.id !== chatId) return;

    const updatedMessages = chat.messages.filter(msg => msg.id?.toString() !== messageId);
    const lastMessage = isLast ? updatedMessages.at(-1) : chat.lastMessage;

    this.setSelectedChatMessages(updatedMessages, lastMessage);

    if (isLast && lastMessage) {
      const updatedChat: IChat = { ...chat, lastMessage };
      this.updateChatsInListById(updatedChat);
    }
  }

  findChatByIdAndUpdateMessage(data: IMessageUpdateResponse): void {
    const { messageData, isLast } = data;
    const { id: messageId, chat: chatId } = messageData;

    const chat = this._selectedChat();
    if (!chat || chat.id !== chatId) return;

    const updatedMessages = chat.messages.map(msg =>
      msg.id == messageId ? { ...msg, ...messageData } : msg
    );

    const lastMessage = isLast ? messageData : chat.lastMessage;
    this.setSelectedChatMessages(updatedMessages, lastMessage);

    if (isLast) {
      const updatedChat: IChat = { ...chat, lastMessage: messageData };
      this.updateChatsInListById(updatedChat);
    }
  }
}
