import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity, OneToMany, ManyToOne } from 'typeorm';
import { TaskList } from './TaskList';
import { User } from './User';

/**
 * Child.
 *
 * @summary representa um membro
 *
 *
 * @extends {BaseEntity}
 */
@Entity()
export class Child extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => User, user => user.children)
    public parent: User;

    @Column()
    public name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    public allowance: number;

    @Column()
    public birthday: Date;

    @Column('mediumtext')
    public photo: string;

    @OneToMany(() => TaskList, childTaskList => childTaskList.child, { eager: true })
    public taskLists: TaskList[];

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
