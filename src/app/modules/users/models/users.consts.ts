import { UsersConfig } from "./users-config.model";

export const listConfig: UsersConfig = {
  filters: {
    searchTermByName: '',
    sortOrder: 'default',
    limit: 10,
    offset: 0,
    excludeKeys: []
  }
};

export const userKeys: string[] = [
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

// В папке с моделями сделал файл consts для такого рода данных.
// Лучше не класть их в сразу компоненте или сервисе