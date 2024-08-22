import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {IUsers} from "../models/users.model";
import {UsersConfig} from "../models/users-config.model";
import {shareReplay} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) {
  }

  fetchUsers(config: UsersConfig) {
    let params = new HttpParams();

    if (config.filters.searchTermByName) {
      params = params.set('searchTermByName', config.filters.searchTermByName);
    }

    return this.httpClient.get<IUsers>('/api/users', { params })
      .pipe(
        shareReplay(1)
      );
  }
}
