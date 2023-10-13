import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserMEssageChatFK1696195139858
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE messages
            ADD FOREIGN KEY (chat_uuid) REFERENCES chats(uuid)`,
    );
    await queryRunner.query(
      `ALTER TABLE messages
            ADD FOREIGN KEY (user_uuid) REFERENCES users(uuid)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE messages DROP CONSTRAINT messages_chat_uuid_fkey',
    );
    await queryRunner.query(
      'ALTER TABLE messages DROP CONSTRAINT messages_user_uuid_fkey',
    );
  }
}
