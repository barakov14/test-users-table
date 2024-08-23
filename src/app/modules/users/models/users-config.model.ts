export interface UsersConfig {
  filters: {
    searchTermByName?: string;
    sortOrder?: 'default' | 'asc' | 'desc';
    offset?: number;
    limit?: number;
    excludeKeys?: string[]
  }
}
