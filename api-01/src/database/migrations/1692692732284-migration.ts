import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692692732284 implements MigrationInterface {
    name = 'Migration1692692732284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "company" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "company"`);
    }

}
