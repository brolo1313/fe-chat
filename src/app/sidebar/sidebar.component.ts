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

  public localSelectedChat: any = null;
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
    this.localSelectedChat = chat;
    this.contextMenuPosition = {
      x: event.clientX,
      y: event.clientY
    };
    this.contextMenuVisible = true;
  }

  public editChat() {
    this.contextMenuVisible = false;
    this.showEditModal();
  }

  public deleteChat() {
    this.contextMenuVisible = false;
    this.showDeleteModal();
  }

  public showCreateModal() {
    this.modalMode = 'create';
    this.modalVisible = true;
  }

  public showEditModal() {
    this.modalMode = 'edit';
    this.modalVisible = true;
  }

  public showDeleteModal() {
    this.modalMode = 'delete';
    this.modalVisible = true;
  }

  handleConfirm(data: any) {
    this.modalVisible = false;
    if (this.modalMode === 'create') {
      const { firstName, lastName } = data;
      this.chatApiService.createChat({ firstName, lastName }).subscribe({
        next: (response: any) => {
          this.getChatList();
        },
        error: (err) => {
          console.error('Create failed', err);
        }
      });
    } else if (this.modalMode === 'edit') {
      const { firstName, lastName } = data;
      this.chatApiService.updateChat(this.localSelectedChat.id, { firstName, lastName }).subscribe({
        next: (response: any) => {
          this.getChatList();
        },
        error: (err) => {
          console.error('Update failed', err);
        }
      });
    } else if (this.modalMode === 'delete') {
      const id = this.localSelectedChat?.id;
      if (!id) return;

      this.chatApiService.deleteChat(id).subscribe({
        next: () => {
          this.getChatList();
          this.localSelectedChat = null;
        },
        error: (err) => {
          console.error('Delete failed', err);
        }
      });
    }
  }

  public onSelectChat(chat: any) {
    this.localSelectedChat = chat;
    this.storeSelectedChat.setSelectChatId(chat.id);
    this.storeSelectedChat.setSelectedChat(chat);
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
