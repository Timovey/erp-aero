import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFileFields1738429254377 implements MigrationInterface {
    name = 'ChangeFileFields1738429254377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`mime\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`originalname\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`mimetype\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`mimetype\``);
        await queryRunner.query(`ALTER TABLE \`file\` DROP COLUMN \`originalname\``);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`file\` ADD \`mime\` varchar(255) NOT NULL`);
    }

}
