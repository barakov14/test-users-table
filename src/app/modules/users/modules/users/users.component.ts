import {ChangeDetectionStrategy, Component, DestroyRef, inject, NgZone, OnInit, signal} from '@angular/core';
import {UsersTableComponent} from "@modules/users/components/users-table/users-table.component";
import {UsersService} from "@modules/users/services/users.service";
import {AsyncPipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ProgressSpinnerComponent} from "@shared/components/progress-spinner/progress-spinner.component";
import {InputDirective} from "@shared/directives/input/input.directive";
import {IUsers, UsersModel} from "@modules/users/models/users.model";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, filter, Observable, switchMap, tap} from "rxjs";
import { UsersConfig } from '@modules/users/models/users-config.model';
import {PaginationComponent} from "@shared/components/pagination/pagination.component";
import {ActivatedRoute, Router} from "@angular/router";
import {IconButtonDirective} from "@shared/directives/icon-button/icon-button.directive";
import {CdkMenu, CdkMenuItem, CdkMenuItemCheckbox, CdkMenuTrigger} from "@angular/cdk/menu";
import { listConfig, userKeys } from '@modules/users/models/users.consts';

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

  // Обьявление переменных, асинк-штучек, и инъекцию сервисов расположил по порядку сверху

  protected readonly Math = Math;

  usersCount = 0;
  listConfig: UsersConfig = listConfig;
  userKeys: string[] = userKeys;

  searchUsersTerm = new FormControl<string>('');

  users = signal<UsersModel>([]);
  usersLoaded = signal<boolean>(false);

  private readonly usersService = inject(UsersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone)


  constructor() {}
  // Убрал нафиг из конструктора инициализирующую логику.
  // Вынес эту логику с init-методы, которые вызвал в ngOnInit
  ngOnInit() {
    this.initListeners();
    this.initFetch();
  }


  private initListeners(): void {
    this.route.queryParams.pipe(
      filter((param) => !!param['page'] || !!param['offset']),
      tap((param) => {
        this.listConfig.filters.limit = param['limit'] ? Number(param['limit']) : 10;
        this.listConfig.filters.offset = (Number(param['page']) - 1) * this.listConfig.filters.limit;
      }),
      switchMap(() => this.loadUsers$()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.usersLoaded.set(true));

    this.searchUsersTerm.valueChanges.pipe(
      debounceTime(300),
      switchMap(term => {
        this.listConfig.filters.searchTermByName = term ?? '';
        return this.loadUsers$();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.usersLoaded.set(true));

  }

  private initFetch(): void {
    this.loadUsers$().subscribe(() => {
      this.usersLoaded.set(true);
    } )
  }


  get currentPage(): number {
    // @ts-ignore
    return Math.floor(this.listConfig.filters.offset / this.listConfig.filters.limit) + 1;
  }

  sortUsersByAge() {
    this.listConfig.filters.sortOrder = this.listConfig.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    this.loadUsers$();
  }

  onChangePage(page: number) {
    this.listConfig.filters.offset = page - 1;
    this.router.navigate([], {queryParams: {page}, queryParamsHandling: 'merge'});

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 200);
    })
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

    this.loadUsers$();
  }

  // часто ты вызывал эту фунцкцию из сервиса.
  // Я его вынес в отдельны метод - убрал копипасту.

  private loadUsers$(): Observable<IUsers> {
    return this.usersService.fetchUsers(this.listConfig)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({users, usersCount}) => {
          this.users.set(users);
          this.usersCount = usersCount;
        })
      )
  }

}

// Я бы накрутил отдельный сервис и как можно больше логики вынес бы туда
