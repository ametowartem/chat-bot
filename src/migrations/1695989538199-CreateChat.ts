import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChat1695989538199 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
              CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `,
    );

    await queryRunner.query(
      `
             CREATE TABLE if not exists chats(
                uuid uuid DEFAULT uuid_generate_v4() primary key,
                chat_name varchar(200) not null 
             )
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          DROP TABLE chats
      `,
    );
  }
}
