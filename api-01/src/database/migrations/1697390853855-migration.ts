import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697390853855 implements MigrationInterface {
    name = 'Migration1697390853855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "secondLastName" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "secondLastName" SET NOT NULL`);
    }

}
