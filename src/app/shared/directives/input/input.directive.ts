import {Directive, ElementRef, inject, OnInit, Renderer2} from "@angular/core";

@Directive({
  selector: '[stInput]',
  standalone: true
})

export class InputDirective implements OnInit {

  private readonly renderer = inject(Renderer2)
  private readonly elementRef: ElementRef<HTMLInputElement> = inject(ElementRef)

  ngOnInit() {
    const el = this.elementRef.nativeElement

    this.renderer.setStyle(el, 'padding', '8px 12px');
    this.renderer.setStyle(el, 'font-size', '16px');
    this.renderer.setStyle(el, 'border', '1px solid #ccc');
    this.renderer.setStyle(el, 'border-radius', '4px');
    this.renderer.setStyle(el, 'outline', 'none');
    this.renderer.setStyle(el, 'transition', 'border-color 0.3s ease');

  }
}
