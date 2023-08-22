import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692688030327 implements MigrationInterface {
    name = 'Migration1692688030327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "dummyField" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dummyField"`);
    }

}
