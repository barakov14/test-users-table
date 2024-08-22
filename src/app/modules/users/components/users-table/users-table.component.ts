import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TableComponent} from "../../../../shared/components/table/table.component";
import {AsyncPipe} from "@angular/common";
import {IUsers, UsersModel} from "../../models/users.model";

@Component({
  selector: 'st-users-table',
  standalone: true,
  imports: [
    TableComponent,
    AsyncPipe
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersTableComponent {
  @Input() users: UsersModel | null = null
}
