import { MigrationInterface, QueryRunner } from "typeorm";

export class AddToken1738329620635 implements MigrationInterface {
    name = 'AddToken1738329620635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`expired_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_c72d39c3d5bf0192fa5a2470d9\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_c72d39c3d5bf0192fa5a2470d9\` ON \`expired_token\``);
        await queryRunner.query(`DROP TABLE \`expired_token\``);
    }

}
