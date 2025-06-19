import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastLoginToUser1750290746429 implements MigrationInterface {
    name = 'AddLastLoginToUser1750290746429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "last_login" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_login"`);
    }

}
