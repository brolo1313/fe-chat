import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { mockChatsList } from '../mocks/chat-list.mock';

@Injectable({ providedIn: 'root' })
export class ChatApiService {

    http = inject(HttpClient);

    public getChatList() {
        return this.http.get(`${environment.apiUrl}/chat/getAll`).pipe(
            (response: any) => {
                return response;
            }
        );
    }

    public createChat(params: { firstName: string, lastName: string }) {
        return this.http.post(`${environment.apiUrl}/chat/create`, params).pipe(
            (response: any) => {
                return response;
            }
        );
    }

    public updateChat(id: number, params: { firstName: string, lastName: string }) {
        return this.http.put(`${environment.apiUrl}/chat/update/${id}`, params).pipe(
            (response: any) => {
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

    public getMessagesByChatId(id: number) {
        return this.http.get(`${environment.apiUrl}/chat/getMessages/${id}`).pipe(
            (response: any) => {
                return response;
            }
        );
    }
}