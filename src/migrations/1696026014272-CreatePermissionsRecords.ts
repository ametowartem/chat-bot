import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserPermission } from '../permission/const/permission.enum';
import { UserRole } from '../role/const/role.enum';

const newPermissions = [
  {
    code: UserPermission.AllowDeleteUsers,
    name: 'Доступ на удаление пользователей',
  },
  {
    code: UserPermission.AllowCreateUsers,
    name: 'Доступ на создание пользователей',
  },
  {
    code: UserPermission.AllowEditUsers,
    name: 'Доступ на редактирование пользователей',
  },
  {
    code: UserPermission.AllowGetUsers,
    name: 'Доступ на получение пользователей',
  },
  {
    code: UserPermission.AllowGetUserProfile,
    name: 'Доступ на получение профиля пользователя',
  },
];

const newRoles = [
  {
    code: UserRole.User,
    name: 'Пользователь',
    permissions: [UserPermission.AllowGetUserProfile],
  },
  {
    code: UserRole.Admin,
    name: 'Администратор',
    permissions: [
      UserPermission.AllowDeleteUsers,
      UserPermission.AllowGetUsers,
      UserPermission.AllowEditUsers,
      UserPermission.AllowCreateUsers,
      UserPermission.AllowGetUserProfile,
    ],
  },
];

export class CreatePermissionsRecords1696026014272
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const permission of newPermissions) {
      await queryRunner.query(
        `
            INSERT INTO permissions (name, code)
            VALUES ($1, $2)
        `,
        [permission.name, permission.code],
      );
    }

    for (const role of newRoles) {
      await queryRunner.query(
        `
              INSERT INTO roles (name, code)
              VALUES ($1, $2)
          `,
        [role.name, role.code],
      );

      if (!role.permissions.length) {
        continue;
      }

      await queryRunner.query(
        `
              INSERT INTO roles_permissions (role_uuid, permission_uuid)
              SELECT (select uuid from roles where code = $1),
              uuid from permissions
              where code in (${role.permissions
                .map((_, index) => `$${index + 2}`)
                .join(', ')})
          `,
        [role.code, ...role.permissions],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM roles_permissions WHERE role_uuid in (SELECT uuid FROM roles)',
    );

    for (const role of newRoles) {
      await queryRunner.query('DELETE FROM roles WHERE code in ($1)', [
        role.code,
      ]);
    }

    for (const permission of newPermissions) {
      await queryRunner.query('DELETE FROM permissions WHERE code in ($1)', [
        permission.code,
      ]);
    }
  }
}
