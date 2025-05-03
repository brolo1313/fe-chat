import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreSelectedChatService {
  private selectedChatId = new BehaviorSubject<number | null>(null);
  selectedChatId$ = this.selectedChatId.asObservable();

  selectChat(id: number) {
    this.selectedChatId.next(id);
  }
}