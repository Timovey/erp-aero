import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTokenDate1738434711971 implements MigrationInterface {
    name = 'AddTokenDate1738434711971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expired_token\` ADD \`expired\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expired_token\` DROP COLUMN \`expired\``);
    }

}
