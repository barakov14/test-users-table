import {Directive, ElementRef, inject, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[stIconButton]',
  standalone: true
})
export class IconButtonDirective implements OnInit {

  private readonly renderer = inject(Renderer2)
  private readonly elementRef: ElementRef<HTMLButtonElement> = inject(ElementRef)

  ngOnInit() {
    const el = this.elementRef.nativeElement
    this.renderer.addClass(el, 'icon-button')
  }

}
