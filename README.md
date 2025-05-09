# FeChat - Real-time Chat Application

**SCREENSHOTS**

<img src="https://github.com/user-attachments/assets/c1a364a0-6d30-47b9-bf0e-8171f0a7c1d0" width="150"/>
<img src="https://github.com/user-attachments/assets/16caec08-a962-46bf-b16d-6671280ab61b" width="250"/>
<img src="https://github.com/user-attachments/assets/6255cf27-7fe3-491e-8d33-00454766b546" width="250"/>
<img src="https://github.com/user-attachments/assets/a765b5e0-3028-485e-8d44-81c668c56573" width="250"/>
<img src="https://github.com/user-attachments/assets/f02932e7-bbd6-485e-9093-fccb10f0e261" width="250"/>
<img src="https://github.com/user-attachments/assets/40c9bf9f-2f40-4b43-9a0d-3baa3357d245" width="250" height="70"/>
<img src="https://github.com/user-attachments/assets/29d75d7f-88c4-41ab-b416-1fa6eeee7d3d" width="250"/>


FeChat is a modern, real-time chat application built with Angular that provides a seamless communication experience for users. The application features real-time messaging capabilities using WebSocket technology and a clean, intuitive user interface.
1 on 1 chat system with auto-response messages from the server(qoutable API). AutoBot status activity indicator wich responses random quatble message to the random chat .
App have 3 predefined chats.
Chat and messsages have CRUD operations.
Resizable logic between sidebar and chat window.
Notifications for needed parts of the app.
Confirmation before removing the chat.
Native hmtl and styles without any UI components libraries or framework dependencies.

## Project Structure

```
src/
├── app/
│   ├── auth/           # Authentication components and services
│   ├── chat-window/    # Main chat interface components
│   ├── sidebar/        # Navigation and user list components
│   ├── socket/         # WebSocket service for real-time communication
│   └── shared/         # Shared components, services, and utilities
├── assets/             # Static assets (images, fonts, etc.)
└── environments/       # Environment configuration files
```

## Key Features

- Real-time messaging using WebSocket
- OAuth2 authentication system
- Clean and modern UI with sidebar navigation
- Dekstop-responsive design
- Real-time user status updates
- Message persistence
- Chat-based chat system 1 on 1 
- Diff environment for development and production

## Tech Stack

- **Frontend**: Angular 19.0.2
- **Build Tool**: Angular CLI
- **Development Environment**: Node.js
- **WebSocket**: Real-time communication
- **Authentication**: JWT-based authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Angular CLI

### Installation

1. Clone the repository:
   ```bash
   git clone [git@github.com:brolo1313/fe-chat.git]
   cd fe-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200/`

## Building

To build the project run:

```bash
ng build
```

BACKEND SOURCE https://github.com/brolo1313/be-chat
BACKEND https://be-chat-qynz.onrender.com/
