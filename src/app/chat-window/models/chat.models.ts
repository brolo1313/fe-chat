export interface IMessage {
    chat: string;
    fromUser?: string;
    text: string;
    isBot: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    id: string;
}

export interface IChat {
    id: string;
    owner: string;
    firstName: string;
    lastName: string;
    messages: IMessage[];
    message?: string;
    imagePath?: string;
    lastMessage?: IMessage;

}

export interface IProfile {
    autoMessaging: boolean;
    chats: IChat[];
    createdAt: string;
    updatedAt: string;
    id: string;
    user: string;
}