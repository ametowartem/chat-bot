import { UserEntity } from '../../user/entity/user.entity';

export interface IDeleteMessage {
  uuid: string;
  user?: UserEntity;
}
