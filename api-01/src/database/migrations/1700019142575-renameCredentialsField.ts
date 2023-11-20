import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameCredentialsField1700019142575 implements MigrationInterface {
    name = 'RenameCredentialsField1700019142575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "credentials" SET DEFAULT '{"aws":{"accessId":null,"secretKey":null}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "credentials" SET DEFAULT '{"aws":{"access_id":null,"secret_key":null}}'`);
    }

}
