import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1695825401649 implements MigrationInterface {
    name = 'Migration1695825401649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "view" ADD "label" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "view" DROP COLUMN "label"`);
    }

}
