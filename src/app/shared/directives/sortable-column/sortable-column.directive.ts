import {Directive, ElementRef, inject, Input, OnInit, Renderer2, signal} from '@angular/core';

@Directive({
  selector: '[stSortableColumn]',
  standalone: true
})
export class SortableColumnDirective implements OnInit {
  sort = signal<'default' | 'asc' | 'desc'>('default')


  @Input() set stSortableColumn(condition: '' | 'asc' | 'desc') {
    if(condition) this.sort.set(condition);
  }

  private readonly renderer = inject(Renderer2)
  private readonly elementRef: ElementRef<HTMLTableColElement> = inject(ElementRef)

  ngOnInit() {
    const el = this.elementRef.nativeElement

    this.renderer.listen(el, 'click', () => {
      const newSort = this.sort() === 'asc' ? 'desc' : 'asc';
      this.sort.set(newSort);
      this.updateSortClass(newSort);
    });

    this.renderer.setStyle(el, 'cursor', 'pointer')

    // Устанавливаем начальный класс в соответствии с текущим состоянием
    this.updateSortClass(this.sort());
  }

  updateSortClass(sort: 'default' | 'asc' | 'desc') {
    const el = this.elementRef.nativeElement
    const existingIcons = el.querySelectorAll('.sort-icon');
    existingIcons.forEach(icon => this.renderer.removeChild(el, icon));

    const icon = this.renderer.createElement('i');
    icon.className = 'sort-icon ri';

    if (this.sort() === 'asc') {
      icon.classList.add('ri-arrow-down-s-fill');
    } else if(this.sort() === 'desc') {
      icon.classList.add('ri-arrow-up-s-fill');
    }

    this.renderer.appendChild(el, icon);
  }
}
