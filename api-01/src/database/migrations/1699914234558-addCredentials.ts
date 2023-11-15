import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCredentials1699914234558 implements MigrationInterface {
    name = 'AddCredentials1699914234558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "credentials" SET DEFAULT '{"aws":{"access_id":null,"secret_key":null}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "credentials" SET DEFAULT '{"auth":{"mfa":false,"mfaFailedTries":0},"notification":{"email":{"priceDbUpdated":false,"newsletter":false}}}'`);
    }

}
