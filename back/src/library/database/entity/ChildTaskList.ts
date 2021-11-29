import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity, OneToMany, ManyToOne } from 'typeorm';
import { Child } from './Child';
import { ChildTask } from './ChildTask';

@Entity()
export class ChildTaskList extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public dateStart: Date;

    @Column()
    public dateEnd: Date;

    @Column()
    public isStarted: boolean;

    @Column()
    public isFinished: boolean;

    @OneToMany(() => ChildTask, childTask => childTask.childTaskList, {
        eager: true
    })
    public ChildTask: ChildTask[];

    @ManyToOne(() => Child, child => child.childTaskList)
    public child: Child;

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
