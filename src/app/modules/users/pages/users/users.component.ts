import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {UsersTableComponent} from "../../components/users-table/users-table.component";
import {UsersService} from "../../services/users.service";
import {AsyncPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ProgressSpinnerComponent} from "../../../../shared/components/progress-spinner/progress-spinner.component";
import {InputDirective} from "../../../../shared/directives/input/input.directive";
import {UsersModel} from "../../models/users.model";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, filter, Observable, switchMap} from "rxjs";
import {UsersConfig} from "../../models/users-config.model";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UsersTableComponent,
    AsyncPipe,
    ProgressSpinnerComponent,
    InputDirective,
    ReactiveFormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly destroyRef = inject(DestroyRef);

  listConfig: UsersConfig = {
    filters: {}
  };

  users= signal<UsersModel>([]);
  usersCount: number = 0;

  searchUsersTerm = new FormControl('') as FormControl<string>;

  usersLoaded = signal<boolean>(false);

  constructor() {
    this.searchUsersTerm.valueChanges.pipe(
      debounceTime(300),
      switchMap(term => {
        this.listConfig.filters.searchTermByName = term;
        return this.usersService.fetchUsers(this.listConfig);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: res => {
        this.users.set(res.users)
        this.usersCount = res.usersCount;
        this.usersLoaded.set(true);
      }
    });
  }

  ngOnInit() {
    this.usersService.fetchUsers(this.listConfig)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => {
          this.users.set(res.users)
          this.usersCount = res.usersCount;
          this.usersLoaded.set(true);
        }
      });
  }
}
