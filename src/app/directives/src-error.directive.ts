import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[srcErrorFallback]',
  standalone: true
})
export class SrcErrorDirective {
  @Input() fallback: string = '';

  @HostListener('error', ['$event'])
  onError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (this.fallback) {
      target.src = this.fallback;
    }
  }
}
