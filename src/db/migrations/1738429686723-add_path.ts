import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPath1738429686723 implements MigrationInterface {
    name = 'AddPath1738429686723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`path\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`path\``);
    }

}
