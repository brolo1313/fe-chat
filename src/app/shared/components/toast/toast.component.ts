import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [
    trigger('toastTrigger', [
      state('open', style({ transform: 'translateY(90%)', opacity: 1 })),
      state('close', style({ transform: 'translateY(-250%)', opacity: 0 })),
      transition('void => open', [
        style({ transform: 'translateY(-250%)', opacity: 0 }),
        animate('300ms ease-in-out')
      ]),
      transition('open => void', [
        animate('300ms ease-in-out', style({ transform: 'translateY(-250%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  toastService = inject(ToastService);


  dismiss(): void {
    this.toastService.dismissToast();
  }
}
