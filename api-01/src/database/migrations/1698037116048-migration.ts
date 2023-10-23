import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1698037116048 implements MigrationInterface {
    name = 'Migration1698037116048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."auth_status_auth_status_type_enum" AS ENUM('mfa')`);
        await queryRunner.query(`CREATE TABLE "auth_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "auth_status_type" "public"."auth_status_auth_status_type_enum" NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "UQ_7edeaf1385bc6c3b8ad5d80fbac" UNIQUE ("user_id", "auth_status_type"), CONSTRAINT "PK_f5619daa1a45857aa2d065f9d21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auth_status" ADD CONSTRAINT "FK_1815ba927cef730a40c22099492" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth_status" DROP CONSTRAINT "FK_1815ba927cef730a40c22099492"`);
        await queryRunner.query(`DROP TABLE "auth_status"`);
        await queryRunner.query(`DROP TYPE "public"."auth_status_auth_status_type_enum"`);
    }

}
