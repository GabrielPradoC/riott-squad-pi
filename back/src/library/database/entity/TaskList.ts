import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BaseEntity, OneToMany, ManyToOne } from 'typeorm';
import { Child } from './Child';
import { ChildTask } from './ChildTask';
import { EnumTaskListState } from '../../../models/EnumTaskListState';

/**
 * TaskList.
 *
 * @summary Representa uma lista de atividades. associada a um membro
 *
 * @remarks Essa entidade(e os endpoints associados) são responsaveis por gerenciar a entidade ChildTask
 * @remarks ChildTask é uma instancia de uma atividade em andamento. diferentemente de Task. Task é apenas um nome de uma ativiade.
 * @remarks ChildTask são associadas a membros(filhos). Tasks são associadas a Users
 *
 * @extends {BaseEntity}
 */
@Entity()
export class TaskList extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public dateStart: Date;

    @Column()
    public dateEnd: Date;

    @Column({ type: 'enum', enum: EnumTaskListState, default: EnumTaskListState.ONHOLD })
    public state: EnumTaskListState;

    @OneToMany(() => ChildTask, childTask => childTask.childTaskList, {
        eager: true,
        cascade: true
    })
    public tasks: ChildTask[];

    @ManyToOne(() => Child, child => child.taskLists)
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
