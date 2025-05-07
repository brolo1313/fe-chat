import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { StoreSelectedChatService } from '../shared/services/store-selected-chat.service';
import { IMessage } from '../chat-window/models/chat.models';
import { TOAST_STATE, ToastService } from '../shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
    private socket!: Socket;

    private storeSelectedChatService = inject(StoreSelectedChatService);
    private toastService = inject(ToastService);
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
            const { id, message } = data;
            this.storeSelectedChatService.updateSelectedChat(message);
        });

        this.onAutoBotMessage((data) => {
            const { message, fullName } = data
            this.storeSelectedChatService.addMessageToChat(message);
            if (message.chat === this.storeSelectedChatService.selectedChat()?.id) {
                this.storeSelectedChatService.updateSelectedChat(message);
            }
            this.toastService.showToaster(TOAST_STATE.success, `New message for <strong>${fullName}</strong>`);
        })
    }

    getSocket(): Socket {
        return this.socket;
    }

    sendMessage(payload: { chatId: string; text: string }) {
        this.socket.emit('send-message', payload);
    }

    onMessage(callback: (data: { id: string; message: IMessage }) => void) {
        this.socket.on('new-message', callback);
    }

    onAutoBotMessage(callback: (data: { message: IMessage, fullName: string }) => void) {
        this.socket.on('auto-bot-message', callback);
    }

    sendAutoBotStatus(status: boolean) {
        this.socket.emit('auto-bot-status', status);
    }

    disconnect() {
        if (this.socket) {
            this.socket.off('new-message');
            this.socket.off('auto-bot-message');
            this.socket.off('connect');
            this.socket.off('connect_error');
            this.socket.off('error');
            this.socket.disconnect();
            console.log('Socket disconnected:', this.socket.id);
        }
    }

}
