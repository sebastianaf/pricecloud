import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697955279172 implements MigrationInterface {
    name = 'Migration1697955279172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "UQ_d6f26f88a48d27b3676a83ac55e" UNIQUE ("user_id", "notification_type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "UQ_d6f26f88a48d27b3676a83ac55e"`);
    }

}
