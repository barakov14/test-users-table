import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {UsersTableComponent} from "../../components/users-table/users-table.component";
import {UsersService} from "../../services/users.service";
import {AsyncPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ProgressSpinnerComponent} from "../../../../shared/components/progress-spinner/progress-spinner.component";
import {InputDirective} from "../../../../shared/directives/input/input.directive";
import {UsersModel} from "../../models/users.model";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, switchMap, tap} from "rxjs";
import {UsersConfig} from "../../models/users-config.model";
import {PaginationComponent} from "../../../../shared/components/pagination/pagination.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UsersTableComponent,
    AsyncPipe,
    ProgressSpinnerComponent,
    InputDirective,
    ReactiveFormsModule,
    PaginationComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  listConfig: UsersConfig = {
    filters: {
      searchTermByName: '',
      age: 'asc',
      limit: 10,
      offset: 0
    }
  };

  users = signal<UsersModel>([]);
  usersCount = 0;

  searchUsersTerm = new FormControl<string>('');

  usersLoaded = signal<boolean>(false);

  constructor() {
    this.route.queryParams.pipe(
      tap((param) => {
        this.listConfig.filters.offset = param['page'] ? Number(param['page']) - 1 : 0;
        this.listConfig.filters.limit = param['limit'] ? Number(param['limit']) : 10;
      }),
      switchMap(() => this.usersService.fetchUsers(this.listConfig)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        this.users.set(res.users);
        this.usersCount = res.usersCount;
        this.usersLoaded.set(true);
      },
      error: (err) => console.log('Error:', err)
    });

    this.searchUsersTerm.valueChanges.pipe(
      debounceTime(300),
      switchMap(term => {
        this.listConfig.filters.searchTermByName = term ?? '';
        return this.usersService.fetchUsers(this.listConfig);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: res => {
        this.users.set(res.users);
        this.usersCount = res.usersCount;
        this.usersLoaded.set(true);
      },
      error: err => console.log('Error:', err)
    });
  }

  ngOnInit() {
    // Обработка инициализации и загрузки данных
    this.usersService.fetchUsers(this.listConfig)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.users.set(res.users);
          this.usersCount = res.usersCount;
          this.usersLoaded.set(true);
        },
        error: err => console.log('Error:', err)
      });
  }

  sortUsersByAge() {
    this.users.update((state) => {
      const sortOrder = this.listConfig.filters.age;
      return [...state].sort((a, b) => sortOrder === 'asc' ? a.age - b.age : b.age - a.age);
    });

    this.listConfig.filters.age = this.listConfig.filters.age === 'asc' ? 'desc' : 'asc';
  }

  onChangePage(page: number) {
    this.listConfig.filters.offset = page - 1;
    this.router.navigate([], {queryParams: {page}, queryParamsHandling: 'merge'});
  }

  onChangeLimit(limit: number) {
    this.listConfig.filters.limit = limit
    this.router.navigate([], {queryParams: {limit: this.listConfig.filters.limit}, queryParamsHandling: 'merge'});
  }

  protected readonly Math = Math;
}
