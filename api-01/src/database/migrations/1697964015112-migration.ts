import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697964015112 implements MigrationInterface {
    name = 'Migration1697964015112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_status" DROP CONSTRAINT "UQ_77d962b714b47965de6edeffcd4"`);
        await queryRunner.query(`ALTER TABLE "notification_status" RENAME COLUMN "notification_type" TO "notification_status_type"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_status_notification_type_enum" RENAME TO "notification_status_notification_status_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notification_status" ADD CONSTRAINT "UQ_a524677996ead9d50d286d18278" UNIQUE ("user_id", "notification_status_type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_status" DROP CONSTRAINT "UQ_a524677996ead9d50d286d18278"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_status_notification_status_type_enum" RENAME TO "notification_status_notification_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notification_status" RENAME COLUMN "notification_status_type" TO "notification_type"`);
        await queryRunner.query(`ALTER TABLE "notification_status" ADD CONSTRAINT "UQ_77d962b714b47965de6edeffcd4" UNIQUE ("notification_type", "user_id")`);
    }

}
