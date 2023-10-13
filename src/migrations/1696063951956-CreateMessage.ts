import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessage1696063951956 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE messages
       (
           uuid uuid DEFAULT uuid_generate_v4() primary key,
           chat_uuid uuid not null ,
           user_uuid uuid not null,
           text varchar(1000) not null,
           time_sending timestamp(0) with time zone default now()
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE messages`);
  }
}
