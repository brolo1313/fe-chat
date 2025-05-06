import { CommonModule } from '@angular/common';
import { Component, computed, effect, HostListener, inject, OnDestroy } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { StoreSelectedChatService } from '../shared/services/store-selected-chat.service';
import { ChatModalComponent } from '../shared/components/chat-modal/chat-modal.component';
import { AuthGoogleService } from '../auth/serice/auth-google.service';
import { LocalStorageUserService } from '../shared/services/local-storage-user.service';
import { ChatApiService } from '../shared/services/chat-api.service';
import { TruncateTextPipe } from '../shared/pipes/trucate-text.pipe';
import { IChat } from '../chat-window/models/chat.models';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, UserAvatarPlaceholderComponent, ReactiveFormsModule, ChatModalComponent, TruncateTextPipe],
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

  public allChats: IChat[] = [];
  public filteredChats: IChat[] = [];

  public localSelectedChat!: IChat | null;
  public searchControl = new FormControl('')
  public trackByFn = (index: number, item: any) => item?.id;

  public contextMenuVisible = false;
  public contextMenuPosition = { x: 0, y: 0 };

  private unsubscribe$ = new Subject();

  @HostListener('document:click')
  hideContextMenu() {
    this.contextMenuVisible = false;
  }

  get showEmptyData(): boolean {
    return !this.accessToken() || !this.filteredChats?.length;
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

    this.setupSearchControl();
  }

  private getChatList() {
    this.chatApiService.getChatList().subscribe((response: any) => {
      this.allChats = response.chats;
      this.filteredChats = [...this.allChats];
    });
  }

  public signInWithGoogle(isAccessToken: boolean) {
    isAccessToken ? this.authService.logout() : this.authService.login();
  }

  public onRightClick(event: MouseEvent, chat: IChat) {
    event.preventDefault();
    this.localSelectedChat = chat;
    this.contextMenuPosition = {
      x: event.clientX,
      y: event.clientY
    };
    this.contextMenuVisible = true;
  }

  public editChatContextMenu() {
    this.contextMenuVisible = false;
    this.showEditModal();
  }

  public deleteChatContextMenu() {
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

  public handleConfirm(data: { firstName: string; lastName: string }): void {
    this.modalVisible = false;
  
    const { firstName, lastName } = data;
  
    switch (this.modalMode) {
      case 'create':
        this.createChat(firstName, lastName);
        break;
  
      case 'edit':
        if (this.localSelectedChat?.id) {
          this.updateChat(this.localSelectedChat.id, firstName, lastName);
        }
        break;
  
      case 'delete':
        if (this.localSelectedChat?.id) {
          this.deleteChat(this.localSelectedChat.id);
        }
        break;
    }
  }

  private createChat(firstName: string, lastName: string): void {
    this.chatApiService.createChat({ firstName, lastName }).subscribe({
      next: () => this.getChatList(),
      error: err => console.error('Create failed', err)
    });
  }
  
  private updateChat(id: string | number, firstName: string, lastName: string): void {
    this.chatApiService.updateChat(id, { firstName, lastName }).subscribe({
      next: () => this.getChatList(),
      error: err => console.error('Update failed', err)
    });
  }
  
  private deleteChat(id: string | number): void {
    this.chatApiService.deleteChat(id).subscribe({
      next: () => {
        this.getChatList();
        this.localSelectedChat = null;
      },
      error: err => console.error('Delete failed', err)
    });
  }

  public onSelectChat(chat: IChat) {
    this.localSelectedChat = chat;
    this.storeSelectedChat.setSelectChatId(chat.id);
    this.storeSelectedChat.setSelectedChat(chat);
  }
   private setupSearchControl(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    ).subscribe((searchValue: string | number | any) => {
      const query = searchValue?.toLowerCase() || '';
      this.filteredChats = this.allChats.filter(chat =>
        chat.firstName?.toLowerCase().includes(query) ||
        chat.lastName?.toLowerCase().includes(query) ||
        (`${chat.firstName} ${chat.lastName}`.toLowerCase().includes(query))
      );
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
