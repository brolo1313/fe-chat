export const mockChatsList = [
    {
        id: 1,
        name: 'Joan',
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
        name: 'Freddy',
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
        name: 'Pit',
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