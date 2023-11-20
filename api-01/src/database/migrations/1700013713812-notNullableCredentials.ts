import { MigrationInterface, QueryRunner } from "typeorm";

export class NotNullableCredentials1700013713812 implements MigrationInterface {
    name = 'NotNullableCredentials1700013713812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "credentials" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "credentials" DROP NOT NULL`);
    }

}
