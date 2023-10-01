import { UserStatus } from '../const/user.status.enum';

export interface IChangeUser {
  uuid: string;
  username?: string;
  password?: string;
  firstName?: string;
  patronymic?: string;
  lastName?: string;
  status?: UserStatus;
  role?: string;
}
