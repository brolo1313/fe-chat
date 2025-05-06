import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { mockChatsList } from '../mocks/chat-list.mock';

@Injectable({ providedIn: 'root' })
export class ChatApiService {

    http = inject(HttpClient);

    public getChatList() {
        return this.http.get(`${environment.apiUrl}/chat/getAll`)
    }

    public createChat(params: { firstName: string, lastName: string }) {
        return this.http.post(`${environment.apiUrl}/chat/create`, params)
    }

    public updateChat(id: number | string, params: { firstName: string, lastName: string }) {
        return this.http.put(`${environment.apiUrl}/chat/update/${id}`, params)
    }


    public deleteChat(id: number | string) {
        return this.http.delete(`${environment.apiUrl}/chat/delete/${id}`)
    }

    public getMessagesByChatId(id: number | string) {
        return this.http.get(`${environment.apiUrl}/chat/getMessages/${id}`)
    }
}