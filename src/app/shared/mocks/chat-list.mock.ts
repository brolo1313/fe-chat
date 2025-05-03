export interface ChatMessage {
    content: string;
    isOwn: boolean;
    time: string;
    date: string;
}

export interface LastMessage {
    message: string;
    time: string;
    date: string;
}

export interface Chat {
    id: number;
    firstName: string;
    lastName: string;
    lastMessage?: LastMessage;
    imagePath?: string;
    messages?: ChatMessage[];
}

export const mockChatsList: Chat[] = [
    {
        id: 1,
        firstName: 'Joan',
        lastName: 'Doe',
        lastMessage: {
            message: 'I am fine, thank you!',
            time: '10:00 AM',
            date: '2023-10-01',
        },

        imagePath: 'assets/images/chat-user-placeholder.jpg',
        messages: [
            { content: 'Hello!', isOwn: true, time: '10:00 AM', date: '2023-10-01' },
            { content: 'Hi there!', isOwn: false, time: '10:00 AM', date: '2023-10-01' },
            { content: 'How are you?', isOwn: true, time: '10:00 AM', date: '2023-10-01' },
            { content: 'I am fine, thank you!', isOwn: false, time: '10:00 AM', date: '2023-10-01' }
        ]
    },
    {
        id: 2,
        firstName: 'Freddy',
        lastName: 'Kruger',
        lastMessage: {
            message: 'Not good yet',
            time: '10:00 AM',
            date: '2023-10-01',
        },
        imagePath: 'assets/images/chat-user-placeholder.jpg',
        messages: [
            { content: 'Hello!', isOwn: true, time: '10:00 AM', date: '2023-10-01' },
            { content: 'Hi there!', isOwn: false, time: '10:00 AM', date: '2023-10-01' },
            { content: 'How are you?', isOwn: true, time: '10:00 AM', date: '2023-10-01' },
            { content: 'Not good yet', isOwn: false, time: '10:00 AM', date: '2023-10-01' }
        ]
    },
    {
        id: 3,
        firstName: 'Pit',
        lastName: 'Bully',
        lastMessage: {
            message: 'Fine, a lot good news',
            time: '10:00 AM',
            date: '2023-10-01',
        },
        imagePath: 'assets/images/chat-user-placeholder.jpg',
        messages: [
            { content: 'Hello!', isOwn: true, time: '10:00 AM', date: '2023-10-01' },
            { content: 'Hi there!', isOwn: false, time: '10:00 AM', date: '2023-10-01' },
            { content: 'How are you?', isOwn: true, time: '10:00 AM', date: '2023-10-01' },
            { content: 'Fine, a lot good news', isOwn: false, time: '10:00 AM', date: '2023-10-01' }
        ]
    }
]