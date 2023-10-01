import { SetMetadata } from '@nestjs/common';
import { UserPermission } from '../const/permission.enum';

export const PERMISSIONS_KEY = 'permissions';
export const PermissionHandler = (...permissions: UserPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
