import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { mockChatsList } from '../mocks/chat-list.mock';

@Injectable({ providedIn: 'root' })
export class ChatApiService {

    http = inject(HttpClient);


    public getChatById(id: number) {
        // const result = this.chatList.find((chat) => chat.id === id);
        return true;
    }

    public getChatList() {
        return this.http.get(`${environment.apiUrl}/chat/getAll`).pipe(
            (response: any) => {
                // this.chatList = response;
                return response;
            }
        );
    }

    public deleteChat(id: number) {
        return this.http.delete(`${environment.apiUrl}/chat/delete/${id}`).pipe(
            (response: any) => {
                return response;
            }
        );
    }
}