import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {UsersTableComponent} from "../../components/users-table/users-table.component";
import {UsersService} from "../../services/users.service";
import {AsyncPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ProgressSpinnerComponent} from "../../../../shared/components/progress-spinner/progress-spinner.component";
import {InputDirective} from "../../../../shared/directives/input/input.directive";
import {UsersModel} from "../../models/users.model";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, filter, switchMap, tap} from "rxjs";
import {UsersConfig} from "../../models/users-config.model";
import {PaginationComponent} from "../../../../shared/components/pagination/pagination.component";
import {ActivatedRoute, Router} from "@angular/router";
import {IconButtonDirective} from "../../../../shared/directives/icon-button/icon-button.directive";
import {CdkMenu, CdkMenuItem, CdkMenuItemCheckbox, CdkMenuTrigger} from "@angular/cdk/menu";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UsersTableComponent,
    AsyncPipe,
    ProgressSpinnerComponent,
    InputDirective,
    ReactiveFormsModule,
    PaginationComponent,
    IconButtonDirective,
    CdkMenuItem,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItemCheckbox,
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
      sortOrder: 'default',
      limit: 10,
      offset: 0,
      excludeKeys: []
    }
  };

  userKeys = [
    "_id",
    "isActive",
    "balance",
    "picture",
    "age",
    "name",
    "company",
    "email",
    "address",
    "tags",
    "favoriteFruit"
  ]

  users = signal<UsersModel>([]);
  usersCount = 0;

  searchUsersTerm = new FormControl<string>('');

  usersLoaded = signal<boolean>(false);

  constructor() {
    this.route.queryParams.pipe(
      filter((param) => !!param['page'] || !!param['offset']),
      tap((param) => {
        this.listConfig.filters.limit = param['limit'] ? Number(param['limit']) : 10;
        this.listConfig.filters.offset = (Number(param['page']) - 1) * this.listConfig.filters.limit;
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

  get currentPage(): number {
    // @ts-ignore
    return Math.floor(this.listConfig.filters.offset / this.listConfig.filters.limit) + 1;
  }

  sortUsersByAge() {
    this.listConfig.filters.sortOrder = this.listConfig.filters.sortOrder === 'asc' ? 'desc' : 'asc';

    this.usersService.fetchUsers(this.listConfig)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.users.set(res.users);
          this.usersCount = res.usersCount;
        },
        error: err => console.log('Error:', err)
      });
  }

  onChangePage(page: number) {
    this.listConfig.filters.offset = page - 1;
    this.router.navigate([], {queryParams: {page}, queryParamsHandling: 'merge'});
  }

  onChangeLimit(limit: number) {
    this.listConfig.filters.limit = limit
    this.router.navigate([], {queryParams: {page: 1, limit: this.listConfig.filters.limit}, queryParamsHandling: 'merge'});
  }

  onExcludeKeys(key: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (!this.listConfig.filters.excludeKeys) {
      this.listConfig.filters.excludeKeys = [];
    }

    const isChecked = inputElement.checked;

    if (isChecked) {
      this.listConfig.filters.excludeKeys = this.listConfig.filters.excludeKeys.filter(k => k !== key);
    } else {
      if (!this.listConfig.filters.excludeKeys.includes(key)) {
        this.listConfig.filters.excludeKeys.push(key);
      }
    }

    // Обновление списка пользователей после изменения excludeKeys
    this.usersService.fetchUsers(this.listConfig)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.users.set(res.users);
          this.usersCount = res.usersCount;
        },
        error: err => console.log('Error:', err)
      });
  }

  protected readonly Math = Math;
}
