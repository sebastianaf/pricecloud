import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692689183785 implements MigrationInterface {
    name = 'Migration1692689183785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "dummyField2" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dummyField3" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dummyField3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dummyField2"`);
    }

}
