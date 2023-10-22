import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697959988459 implements MigrationInterface {
    name = 'Migration1697959988459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_status_notification_type_enum" AS ENUM('priceDbUpdated', 'newsletter')`);
        await queryRunner.query(`CREATE TABLE "notification_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "notification_type" "public"."notification_status_notification_type_enum" NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "UQ_77d962b714b47965de6edeffcd4" UNIQUE ("user_id", "notification_type"), CONSTRAINT "PK_112603a16eaf8cc6832d517586a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification_status" ADD CONSTRAINT "FK_4d7855bb46aa7d03287f9ee2b2a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_status" DROP CONSTRAINT "FK_4d7855bb46aa7d03287f9ee2b2a"`);
        await queryRunner.query(`DROP TABLE "notification_status"`);
        await queryRunner.query(`DROP TYPE "public"."notification_status_notification_type_enum"`);
    }

}
