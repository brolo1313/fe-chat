import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText = '';

  tooltip!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltipText || this.tooltip) return;
    this.createTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltip) {
      this.destroyTooltip();
    }
  }

  private createTooltip() {
    this.tooltip = this.renderer.createElement('span');
    this.tooltip.innerText = this.tooltipText;
    this.renderer.addClass(this.tooltip, 'custom-tooltip');

    const hostPos = this.el.nativeElement.getBoundingClientRect();

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    this.renderer.setStyle(this.tooltip, 'position', 'absolute');
    this.renderer.setStyle(this.tooltip, 'top', `${hostPos.top + scrollTop - 0}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${hostPos.left + scrollLeft + 40}px`);
    this.renderer.setStyle(this.tooltip, 'font-size', `15px`);


    this.renderer.appendChild(document.body, this.tooltip);
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'help');
  }

  private destroyTooltip() {
    this.renderer.removeChild(document.body, this.tooltip);
    this.tooltip = undefined!;
  }

}
