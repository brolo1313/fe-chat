import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-modal',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss']
})
export class ChatModalComponent implements OnInit {
  @Input() mode: 'create' | 'delete' | 'edit' = 'create';
  @Input() chat: any | null = null;

  @Output() confirm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  public firstName = new FormControl(null, [Validators.required]);
  public lastName = new FormControl(null, [Validators.required]);

  ngOnInit() {
    if (this.mode === 'edit' && this.chat) {
      const { firstName, lastName } = this.chat;
      this.firstName.setValue(firstName || '');
      this.lastName.setValue(lastName || '');
    }
  }
  onConfirm() {
    if (this.mode === 'create') {
      this.confirm.emit({
        firstName: this.firstName.value,
        lastName: this.lastName.value
      });
    } else if (this.mode === 'edit') {
      this.confirm.emit({
        id: this.chat?.id,
        firstName: this.firstName.value,
        lastName: this.lastName.value
      });
    } else if (this.mode === 'delete') {
      this.confirm.emit({
        id: this.chat?.id
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
