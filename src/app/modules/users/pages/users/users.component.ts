import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {UsersTableComponent} from "../../components/users-table/users-table.component";
import {UsersService} from "../../services/users.service";
import {AsyncPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ProgressSpinnerComponent} from "../../../../shared/components/progress-spinner/progress-spinner.component";
import {InputDirective} from "../../../../shared/directives/input/input.directive";
import {UsersModel} from "../../models/users.model";
import {FormControl} from "@angular/forms";

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
export class UsersComponent implements OnInit {
  private readonly usersService= inject(UsersService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly cdr = inject(ChangeDetectorRef)

  users: UsersModel  = []
  usersCount: number = 0

  searchUsers = new FormControl('') as FormControl<string>

  usersLoaded = signal<boolean>(false)

  ngOnInit() {
    this.usersService.fetchUsers()
      .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
      .subscribe({
        next: (res) => {
          this.usersLoaded.set(true)
          this.users = res.users
          this.usersCount = res.usersCount
        }
      })
  }
}
