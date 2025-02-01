import { MigrationInterface, QueryRunner } from "typeorm";

export class AddExt1738431192143 implements MigrationInterface {
    name = 'AddExt1738431192143'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`extension\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`extension\``);
    }

}
