import { RoleEntity } from '../../role/entity/role.entity';

export class PayloadInterface {
  username: string;
  uuid: string;
  jti: string;
  exp: number;
  role: RoleEntity;
}
