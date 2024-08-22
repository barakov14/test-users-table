import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {IUsers} from "../models/users.model";
import {UsersConfig} from "../models/users-config.model";
import {shareReplay} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly httpClient = inject(HttpClient)

  fetchUsers(config: UsersConfig) {
    let params = new HttpParams();

    Object.keys(config.filters).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config.filters[key])
    });

    return this.httpClient.get<IUsers>('/api/users', { params })
      .pipe(
        shareReplay(1)
      );
  }
}
