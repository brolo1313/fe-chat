import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { StoreSelectedChatService } from '../shared/services/store-selected-chat.service';
import { mockChatsList } from '../shared/mocks/chat-list.mock';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, UserAvatarPlaceholderComponent, ReactiveFormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

  storeSelectedChat = inject(StoreSelectedChatService);

  private unsubscribe$ = new Subject();

  public searchControl = new FormControl('')

  public filteredChats: any[] = [];

  public chats = mockChatsList;

  public trackByFn = (index: number, item: any) => item?.id;

  ngOnInit() {
    this.filteredChats = this.chats
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
      this.filteredChats = this.chats.filter(value => value.name.toLowerCase().includes(searchValue!.toLowerCase()))
    }
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
