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
    await queryRunner.query('ALTER TABLE messages DROP CONSTRAINT chat_uuid');
    await queryRunner.query('ALTER TABLE messages DROP CONSTRAINT user_uuid');
  }
}
