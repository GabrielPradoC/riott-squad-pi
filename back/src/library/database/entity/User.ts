import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity, OneToMany } from 'typeorm';
import { Child } from './Child';
import { Task } from './Task';

/**
 * User.
 *
 * @summary Representa um Usuario.
 * @remarks as relations dessa entitade são eager.
 * @see https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations
 *
 * @extends {BaseEntity}
 */
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    public name: string;

    @Column({ unique: true })
    public email: string;

    @Column()
    public passwordHash: string;

    @OneToMany(() => Task, task => task.parent, {
        eager: true
    })
    public createdTasks: Task[];

    @OneToMany(() => Child, child => child.parent, {
        eager: true
    })
    public children: Child[];

    @Column()
    public createdAt: Date;

    @Column()
    public updatedAt: Date;

    @BeforeInsert()
    public setCreateDate(): void {
        this.createdAt = new Date();
    }

    @BeforeInsert()
    @BeforeUpdate()
    public setUpdateDate(): void {
        this.updatedAt = new Date();
    }
}
