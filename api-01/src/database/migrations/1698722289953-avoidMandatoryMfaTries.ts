import { MigrationInterface, QueryRunner } from "typeorm";

export class AvoidMandatoryMfaTries1698722289953 implements MigrationInterface {
    name = 'AvoidMandatoryMfaTries1698722289953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification_code" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "verification_code" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "verification_code" ALTER COLUMN "times_used" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification_code" ALTER COLUMN "times_used" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "verification_code" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "verification_code" ADD "code" integer NOT NULL`);
    }

}
