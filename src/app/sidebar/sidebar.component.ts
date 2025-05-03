import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserAvatarPlaceholderComponent } from '../shared/components/user-avatar-placeholder/user-avatar-placeholder.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, UserAvatarPlaceholderComponent, ReactiveFormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  public searchControl = new FormControl('')

  public filteredChats: any[] = [];

  public chats = [
    {
      id: 1,
      name: 'Chat 1',
      lastMessage: 'Hello!',
      time: '10:00 AM',
      date: '2023-10-01',
      imagePath: 'assets/images/chat-user-placeholder.jpg'
    },
    {
      id: 2,
      name: 'Chat 2',
      lastMessage: 'How are you?',
      time: '10:05 AM',
      date: '2023-10-01',
      imagePath: 'assets/images/chat-user-placeholder.jpg'
    },
    {
      id: 3,
      name: 'Chat 3',
      lastMessage: 'Goodbye!',
      time: '10:10 AM',
      date: '2023-10-01',
      imagePath: 'assets/images/chat-user-placeholder.jpg'
    }
  ]

  public trackByFn = (index: number, item: any) => item?.id;

  ngOnInit() {
    this.filteredChats = this.chats
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
