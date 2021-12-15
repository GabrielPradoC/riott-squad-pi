import { Child } from '../../../../library/database/entity/Child';
import { TaskList } from '../../../../library/database/entity/TaskList';
import { ChildTask } from '../../../../library/database/entity/ChildTask';
import { EnumTaskListState } from '../../../../models/EnumTaskListState';

interface ListResults {
    missedTasksCount: number;
    totalDebit: number;
    currentAllowance: number;
}

/**
 * getListResults.
 *
 * retorna o resultado da lista de tarefas ativa
 *
 * @param member - Criança, que pode ou não ter uma lista ativa
 * @returns
 */
export const getListResults = (member: Child): ListResults => {
    const activeList: TaskList | undefined = member.taskLists.find((list: TaskList) => list.state === EnumTaskListState.STARTED);

    if (!activeList) return { missedTasksCount: 0, totalDebit: 0, currentAllowance: 0 };

    const missedTasks: ChildTask[] = activeList.tasks.filter((task: ChildTask) => task.isMissed);
    const totalDebit: number = missedTasks.reduce((accomulator: number, task: ChildTask) => accomulator + task.value, 0);

    const { allowance } = member;

    const results: ListResults = {
        missedTasksCount: missedTasks.length,
        totalDebit,
        currentAllowance: allowance - totalDebit
    };

    return results;
};
