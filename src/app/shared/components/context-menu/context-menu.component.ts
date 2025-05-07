import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  imports: [],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {
  @Input() contextMenuVisible = false;
  @Input() contextMenuPosition = { x: 0, y: 0 };

  @Output() editChat = new EventEmitter<void>();
  @Output() deleteChat = new EventEmitter<void>();

  public readonly textEdit = 'Edit';
  public readonly textDelete = 'Delete';

  private menuWidth = 150
  private padding = 10;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contextMenuVisible'] && this.contextMenuVisible) {
      this.preventBlockMoveOutViewPort()
    }
  }

  onCLickEdit() {
    this.editChat.emit();
  }

  onCLickDelete() {
    this.deleteChat.emit();
  }

  preventBlockMoveOutViewPort() {
    const screenWidth = window.innerWidth;

    let x = this.contextMenuPosition.x;
    let y = this.contextMenuPosition.y;

    if (x + this.menuWidth + this.padding > screenWidth) {
      x = screenWidth - this.menuWidth - this.padding;
    }

    this.contextMenuPosition = { x, y };
  }
}
