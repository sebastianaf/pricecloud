import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1697952505119 implements MigrationInterface {
  name = 'Migration1697952505119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."notification_notification_type_enum" AS ENUM('priceDbUpdated', 'newsletter')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8"`,
    );
  }
}
