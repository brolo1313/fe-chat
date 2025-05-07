import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { mockChatsList } from '../mocks/chat-list.mock';
import { IProfile } from '../../chat-window/models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatApiService {

    http = inject(HttpClient);

    public getProfile(): Observable<IProfile> {
        return this.http.get<IProfile>(`${environment.apiUrl}/chat/getAll`)
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

    public getMessagesByChatId(id: number | string): any {
        return this.http.get(`${environment.apiUrl}/chat/getMessages/${id}`)
    }

    public deleteMessage(id: number | string) {
        return this.http.delete(`${environment.apiUrl}/chat/deleteMessage/${id}`)
    }

    public updateMessage(id: number | string, message: string) {
        return this.http.put(`${environment.apiUrl}/chat/updateMessage/${id}`, message)
    }
}