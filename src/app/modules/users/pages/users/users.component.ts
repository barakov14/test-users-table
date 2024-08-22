import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {UsersTableComponent} from "../../components/users-table/users-table.component";
import {Observable, tap} from "rxjs";
import {UsersModel} from "../../models/users.model";
import {UsersService} from "../../services/users.service";
import {AsyncPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UsersTableComponent,
    AsyncPipe
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {
  users$= inject(UsersService).fetchUsers().pipe(
    tap(() => this.usersLoaded = true),
    takeUntilDestroyed()
  )

  usersLoaded = false
}
