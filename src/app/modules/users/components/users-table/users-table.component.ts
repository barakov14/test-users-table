import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TableComponent} from "../../../../shared/components/table/table.component";
import {AsyncPipe, NgClass, NgStyle} from "@angular/common";
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
    SortableColumnDirective
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersTableComponent {
  @Input() users: UsersModel | null = null
  @Output() sortUsers = new EventEmitter<void>()

  columns: string[] = []

  onSortUsersByAge() {
    this.sortUsers.emit()
  }
}
