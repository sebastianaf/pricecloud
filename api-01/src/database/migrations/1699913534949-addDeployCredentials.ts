import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeployCredentials1699913534949 implements MigrationInterface {
    name = 'AddDeployCredentials1699913534949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "credentials" json DEFAULT '{"auth":{"mfa":false,"mfaFailedTries":0},"notification":{"email":{"priceDbUpdated":false,"newsletter":false}}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "credentials"`);
    }

}
