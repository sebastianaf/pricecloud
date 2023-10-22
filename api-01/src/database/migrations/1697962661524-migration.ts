import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697962661524 implements MigrationInterface {
    name = 'Migration1697962661524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."login_event_enum" AS ENUM('login', 'logout')`);
        await queryRunner.query(`CREATE TABLE "login" ("id" SERIAL NOT NULL, "ip" character varying, "location" character varying, "timezone" character varying, "user_agent" text, "event" "public"."login_event_enum" NOT NULL DEFAULT 'login', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_0e29aa96b7d3fb812ff43fcfcd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notification_status_notification_type_enum" AS ENUM('priceDbUpdated', 'newsletter')`);
        await queryRunner.query(`CREATE TABLE "notification_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "notification_type" "public"."notification_status_notification_type_enum" NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "UQ_77d962b714b47965de6edeffcd4" UNIQUE ("user_id", "notification_type"), CONSTRAINT "PK_112603a16eaf8cc6832d517586a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "company" character varying, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "second_name" character varying, "first_last_name" character varying NOT NULL, "second_last_name" character varying, "login_count" integer NOT NULL DEFAULT '0', "is_email_verified" boolean NOT NULL DEFAULT false, "country" character varying, "timezone" character varying, "active" boolean NOT NULL DEFAULT true, "language" character varying NOT NULL DEFAULT 'es', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "role_id" integer NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" integer NOT NULL, "label" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "view" ("id" integer NOT NULL, "label" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_86cfb9e426c77d60b900fe2b543" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_view" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "role_id" integer, "view_id" integer, CONSTRAINT "unique_role_view" UNIQUE ("role_id", "view_id"), CONSTRAINT "PK_696e9edcbdc75a2631a95428a1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "login" ADD CONSTRAINT "FK_6da2fec3d330c1b6c67c427937e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_status" ADD CONSTRAINT "FK_4d7855bb46aa7d03287f9ee2b2a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_view" ADD CONSTRAINT "FK_5e74f3edf0388b8b15cc6310b32" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_view" ADD CONSTRAINT "FK_81544ef2dcde118229386f89b29" FOREIGN KEY ("view_id") REFERENCES "view"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_view" DROP CONSTRAINT "FK_81544ef2dcde118229386f89b29"`);
        await queryRunner.query(`ALTER TABLE "role_view" DROP CONSTRAINT "FK_5e74f3edf0388b8b15cc6310b32"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`ALTER TABLE "notification_status" DROP CONSTRAINT "FK_4d7855bb46aa7d03287f9ee2b2a"`);
        await queryRunner.query(`ALTER TABLE "login" DROP CONSTRAINT "FK_6da2fec3d330c1b6c67c427937e"`);
        await queryRunner.query(`DROP TABLE "role_view"`);
        await queryRunner.query(`DROP TABLE "view"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "notification_status"`);
        await queryRunner.query(`DROP TYPE "public"."notification_status_notification_type_enum"`);
        await queryRunner.query(`DROP TABLE "login"`);
        await queryRunner.query(`DROP TYPE "public"."login_event_enum"`);
    }

}
