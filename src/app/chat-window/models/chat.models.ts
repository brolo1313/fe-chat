export interface IMessage {
    chat: string;
    fromUser?: string;
    text: string;
    isBot: boolean;
    deleted: boolean;
    createdAt: string;
    id: string;
}

export interface IChat {
    chatId: string;
    owner: string;
    firstName: string;
    lastName: string;
    messages: IMessage[];
    message: string;
}
