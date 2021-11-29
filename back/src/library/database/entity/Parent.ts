import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity, OneToMany } from 'typeorm';
import { Child } from './Child';
import { Task } from './Task';

@Entity()
export class Parent extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public email: string;

    @Column()
    public password: string;

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
