import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IUsers} from "../models/users.model";


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) {
  }

  fetchUsers() {
    return this.httpClient.get<IUsers>('/api/users')
  }
}
