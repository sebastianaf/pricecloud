import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPriceCount1702643586042 implements MigrationInterface {
  name = 'AddPriceCount1702643586042';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "price_count" ("id" character varying NOT NULL, "count" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_060838e0a0b68ca00e2e1785882" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "price_count"`);
  }
}
