import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {UsersTableComponent} from "../../components/users-table/users-table.component";
import {tap} from "rxjs";
import {UsersService} from "../../services/users.service";
import {AsyncPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ProgressSpinnerComponent} from "../../../../shared/components/progress-spinner/progress-spinner.component";
import {InputDirective} from "../../../../shared/directives/input/input.directive";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UsersTableComponent,
    AsyncPipe,
    ProgressSpinnerComponent,
    InputDirective
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
