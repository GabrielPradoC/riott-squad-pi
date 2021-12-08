import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../../src/library/database/entity';

export class User1638981988019 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const newUser: User = queryRunner.manager.create(User, {
            name: 'User',
            email: 'email@example.com',
            passwordHash: '$2b$10$n/z6hcEpelsSyNnRmHZ5nu6beWrdQ993CNoY1IA.cCQ7AAXWMK2ou',
            createdTasks: [],
            children: []
        });
        await queryRunner.manager.save(User, newUser);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(User, { name: 'User' });
    }
}
