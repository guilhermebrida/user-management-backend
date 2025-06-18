import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserTable1750269023782 implements MigrationInterface {
    name = 'AlterUserTable1750269023782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "update_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
