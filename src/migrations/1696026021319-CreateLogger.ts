import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLogger1696026021319 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE logger
       (
           uuid uuid DEFAULT uuid_generate_v4() primary key,
           author_uuid uuid not null ,
           method varchar(255) not null ,
           user_uuid uuid not null,
           jsonb jsonb 
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE logger`);
  }
}
