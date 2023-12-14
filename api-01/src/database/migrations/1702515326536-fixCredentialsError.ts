import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCredentialsError1702515326536 implements MigrationInterface {
    name = 'FixCredentialsError1702515326536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "credentials" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "credentials" SET NOT NULL`);
    }

}
