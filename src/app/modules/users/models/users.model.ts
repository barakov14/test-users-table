import { IUser } from "@shared/models/users.model";

export interface IUsers {
  users: UsersModel;
  usersCount: number;
}

export type UsersModel = IUser[]
