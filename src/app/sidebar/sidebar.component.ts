import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { StoreSelectedChatService } from '../shared/services/store-selected-chat.service';
import { mockChatsList } from '../shared/mocks/chat-list.mock';
import { ChatModalComponent } from '../shared/components/chat-modal/chat-modal.component';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, UserAvatarPlaceholderComponent, ReactiveFormsModule, ChatModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

  storeSelectedChat = inject(StoreSelectedChatService);

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

  ngOnInit() {
    this.filteredChats = this.chats
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
      console.log('Delete chat with ID:', data.id);
      const chatIndex = this.chats.findIndex((chat) => chat.id === data.id);
      if (chatIndex !== -1) {
        this.chats.splice(chatIndex, 1);
      }
      this.selectedChat = null;
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
    ).subscribe((searchValue) => {
      this.filteredChats = this.chats.filter(value => value.firstName.toLowerCase().includes(searchValue!.toLowerCase()))
    }
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
