import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TableComponent} from "../../../../shared/components/table/table.component";
import {AsyncPipe, NgClass, NgIf, NgStyle} from "@angular/common";
import {IUsers, UsersModel} from "../../models/users.model";
import {SortableColumnDirective} from "../../../../shared/directives/sortable-column/sortable-column.directive";

@Component({
  selector: 'st-users-table',
  standalone: true,
  imports: [
    TableComponent,
    AsyncPipe,
    NgClass,
    NgStyle,
    SortableColumnDirective,
    NgIf
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersTableComponent {
  @Input() users: UsersModel | null = null
  @Output() sortUsers = new EventEmitter<void>()

  @Input() columns: string[] = []

  @Input() excludedColumns: string[] = []

  onSortUsersByAge() {
    this.sortUsers.emit()
  }

  get columnsIncluded(): string[] {
    return this.columns.filter((column) => !this.excludedColumns.includes(column))
  }


  isColumnExcluded(key: string) {
    return this.excludedColumns.includes(key)
  }

  protected readonly Object = Object;
}
