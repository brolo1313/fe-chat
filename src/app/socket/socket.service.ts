import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { StoreSelectedChatService } from '../shared/services/store-selected-chat.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
    private socket!: Socket;

    private storeSelectedChatService = inject(StoreSelectedChatService);

    connect(token: string | undefined) {
        this.socket = io(environment.socketUrl, {
            auth: { token },
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected to socket:', this.socket.id);
        });

        this.socket.on('error', (err) => {
            console.error('❌ Socket error req or res:', err);
        });

        this.socket.on('connect_error', (err) => {
            console.error('❌ Socket connection error:', err.message);
        });

        this.onMessage((data) => {
            const {chatId, message} = data;
            console.log('onMessage', data);
            this.storeSelectedChatService.updateSelectedChat(message);
        });
    }

    sendMessage(payload: { chatId: string; text: string }) {
        this.socket.emit('send-message', payload);
    }

    onMessage(callback: (data: any) => void) {
        this.socket.on('new-message', callback);
    }

    disconnect() {
        if (this.socket) {
            console.log('Socket disconnected:', this.socket.id);
            this.socket.disconnect();
        }
    }

    getSocket(): Socket {
        return this.socket;
    }
}
