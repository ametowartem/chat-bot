import { OrderDirection } from '../const/order-direction.enum';
import { UserStatus } from '../const/user.status.enum';

export interface IGetUsers {
  filters?: IFilters;
  sorting?: ISorting;
  pagination?: IPagination;
}

interface IFilters {
  search?: string;
  statuses?: UserStatus[];
  userUuids?: string[];
}

interface ISorting {
  field?: string;
  direction?: OrderDirection;
}

interface IPagination {
  page?: number;
  limit?: number;
}
