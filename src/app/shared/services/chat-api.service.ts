import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { mockChatsList } from '../mocks/chat-list.mock';

@Injectable({ providedIn: 'root' })
export class ChatApiService {

    // http = inject(HttpClient);

    private chatList = mockChatsList;

    public getChatById(id: number) {
        const result = this.chatList.find((chat) => chat.id === id);
        return result;
    }

}