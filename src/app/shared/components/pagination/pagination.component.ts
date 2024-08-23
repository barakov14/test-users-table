import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'st-pagination',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 0;
  @Input() limit: number = 10;

  @Output() changePage = new EventEmitter<number>()
  @Output() changeLimit = new EventEmitter<number>()


  getPagesCount() {
    return [...Array(this.totalPages).keys()].map(el => el + 1)
  }

  onChangePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.changePage.emit(page);
    }
  }

  onChangeLimit(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.changeLimit.emit(Number(target.value));
  }
}
