import { MigrationInterface, QueryRunner } from "typeorm";

export class StringCredentialsField1700014722316 implements MigrationInterface {
    name = 'StringCredentialsField1700014722316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "credentials"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "credentials" text NOT NULL DEFAULT '{"aws":{"access_id":null,"secret_key":null}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "credentials"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "credentials" json NOT NULL DEFAULT '{"aws":{"access_id":null,"secret_key":null}}'`);
    }

}
