import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1693405821889 implements MigrationInterface {
    name = 'Migration1693405821889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "company" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "company"`);
    }

}
