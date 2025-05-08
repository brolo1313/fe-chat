import { Component, EventEmitter, Host, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-resizer-screen',
  imports: [],
  templateUrl: './resizer-screen.component.html',
  styleUrl: './resizer-screen.component.scss'
})
export class ResizerScreenComponent {
  private isResizing = false
  @Output() onResize = new EventEmitter<any>(

  )
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: any) {
    if (!this.isResizing) return

    if (event.clientX < 350 || event.clientX > 800) return
    this.onResize.emit(event.clientX);
    event.preventDefault();
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: any) {
    this.isResizing = false
  }

  onMouseDown(event: MouseEvent) {
    this.isResizing = true;
    event.preventDefault();
  }
}
