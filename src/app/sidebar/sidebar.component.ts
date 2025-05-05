import { CommonModule } from '@angular/common';
import { Component, computed, effect, HostListener, inject, OnDestroy } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { StoreSelectedChatService } from '../shared/services/store-selected-chat.service';
import { mockChatsList } from '../shared/mocks/chat-list.mock';
import { ChatModalComponent } from '../shared/components/chat-modal/chat-modal.component';
import { AuthGoogleService } from '../auth/serice/auth-google.service';
import { LocalStorageUserService } from '../shared/services/local-storage-user.service';
import { ChatApiService } from '../shared/services/chat-api.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, UserAvatarPlaceholderComponent, ReactiveFormsModule, ChatModalComponent,],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnDestroy {

  private storeSelectedChat = inject(StoreSelectedChatService);
  private authService = inject(AuthGoogleService);
  public localStorageService = inject(LocalStorageUserService);
  public chatApiService = inject(ChatApiService);

  readonly accessToken = computed(() => this.localStorageService.userSettings()?.accessToken);
  readonly photoUrl = computed(() => this.localStorageService.userSettings()?.picture);

  public modalVisible = false;
  public modalMode: 'create' | 'delete' | 'edit' = 'create';

  public selectedChat: any = null;
  public searchControl = new FormControl('')
  public filteredChats: any[] = [];
  public chats = mockChatsList;
  public trackByFn = (index: number, item: any) => item?.id;

  public contextMenuVisible = false;
  public contextMenuPosition = { x: 0, y: 0 };

  private unsubscribe$ = new Subject();

  @HostListener('document:click')
  hideContextMenu() {
    this.contextMenuVisible = false;
  }

  private chatListFetched = false;
  constructor() {
    effect(() => {
      const token = this.localStorageService.userSettings()?.accessToken;
      if (token && !this.chatListFetched) {
        this.chatListFetched = true;
        this.getChatList();
      }
    });
  }

  private getChatList() {
    this.chatApiService.getChatList().subscribe((response: any) => {
      console.log('response', response);
      this.filteredChats = response.chats;
    });
  }


  signInWithGoogle(isAccessToken: boolean) {
    if (!isAccessToken) {
      this.authService.login();
    } else {
      this.authService.logout();
    }
  }

  public onRightClick(event: MouseEvent, chat: any) {
    event.preventDefault();
    this.selectedChat = chat;
    this.contextMenuPosition = {
      x: event.clientX,
      y: event.clientY
    };
    this.contextMenuVisible = true;
  }

  public editChat(chat: any) {
    this.contextMenuVisible = false;
    this.showEditModal();
  }

  public deleteChat(chat: any) {
    console.log('deleteChat', chat);
    this.contextMenuVisible = false;
    this.showDeleteModal(chat.id);
  }

  public showCreateModal() {
    this.modalMode = 'create';
    this.modalVisible = true;
  }

  public showEditModal() {
    this.modalMode = 'edit';
    this.modalVisible = true;
  }

  public showDeleteModal(id: number) {
    this.modalMode = 'delete';
    this.modalVisible = true;
  }

  handleConfirm(data: any) {
    this.modalVisible = false;
    if (this.modalMode === 'create') {
      console.log('Create chat with:', data);
      this.chats.push({
        id: Math.floor(Math.random() * 500) + 1,
        firstName: `${data.firstName}`,
        lastName: `${data.lastName}`,
      });
    } else if (this.modalMode === 'edit') {
      const chatIndex = this.chats.findIndex((chat) => chat.id === data.id);
      if (chatIndex !== -1) {
        this.chats[chatIndex].firstName = data.firstName;
        this.chats[chatIndex].lastName = data.lastName;
      }
      console.log('Edit chat with:', data);
    } else if (this.modalMode === 'delete') {
      const id = this.selectedChat?.id;
      if (!id) return;

      this.chatApiService.deleteChat(id).subscribe({
        next: () => {
          this.getChatList();
          this.selectedChat = null;
        },
        error: (err) => {
          console.error('Delete failed', err);
        }
      });
    }
  }

  public onSelectChat(chat: any) {
    console.log('chat', chat);
    this.storeSelectedChat.selectChat(chat.id);
  }
  public onChangeSearchControl() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe((searchValue: any) => {
      this.filteredChats = this.chats.filter(value =>
        (value.firstName?.toLowerCase().includes(searchValue?.toLowerCase())) ||
        (value.lastName?.toLowerCase().includes(searchValue?.toLowerCase())) ||
        (value.firstName && value.lastName && `${value.firstName} ${value.lastName}`.toLowerCase().includes(searchValue?.toLowerCase()))
      );
    }
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
