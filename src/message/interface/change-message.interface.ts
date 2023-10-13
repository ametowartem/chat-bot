import { UserEntity } from '../../user/entity/user.entity';

export interface IChangeMessage {
  uuid: string;
  text: string;
  user?: UserEntity;
}
