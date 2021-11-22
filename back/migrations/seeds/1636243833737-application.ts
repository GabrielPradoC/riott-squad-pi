import { MigrationInterface, QueryRunner } from 'typeorm';
import { Application } from '../../src/library/database/entity/Application';

export class application1636243833737 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const credential = queryRunner.manager.create('Application', {
            key: 'bb95eb32eaa950c8f33ef1b1',
            label: 'Sistema admin'
        });

        await queryRunner.manager.save(Application, credential);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(Application, { key: 'bb95eb32eaa950c8f33ef1b1' });
    }
}
