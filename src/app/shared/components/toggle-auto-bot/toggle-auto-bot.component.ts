import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
  selector: 'app-toggle-auto-bot',
  imports: [TooltipDirective],
  templateUrl: './toggle-auto-bot.component.html',
  styleUrl: './toggle-auto-bot.component.scss'
})
export class ToggleAutoBotComponent {
  @Input() autoBotStatus = false;
  @Output() onToggleAutoBot = new EventEmitter<boolean>();
  public toggleAutoBot(status:boolean) {
    this.onToggleAutoBot.emit(status);
    console.log('toggleAutoBot', status);
  }
}
