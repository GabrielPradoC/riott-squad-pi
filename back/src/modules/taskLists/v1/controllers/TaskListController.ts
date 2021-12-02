// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Delete, Get, Middlewares, Post, Put } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { TaskList, ChildTask } from '../../../../library/database/entity';

// Repositories
import { TaskListRepository } from '../../../../library/database/repository';

// Validators
import { TaskListValidator } from '../middlewares/TaskListValidator';

@Controller(EnumEndpoints.LIST_V1)
export class TaskListController extends BaseController {
    /**
     * @swagger
     * /v1/list:
     *   get:
     *     summary: Lista as listas de atividades
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '#/components/parameters/listPageRef'
     *       - $ref: '#/components/parameters/listSizeRef'
     *       - $ref: '#/components/parameters/listOrderRef'
     *       - $ref: '#/components/parameters/listOrderByRef'
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get()
    public async get(req: Request, res: Response): Promise<void> {
        const [rows, count] = await new TaskListRepository().list<TaskList>(TaskListController.listParams(req));
        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     * /v1/list/{listId}:
     *   get:
     *     summary: Retorna informações de uma lista de atividades
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: listId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/:id')
    @Middlewares(TaskListValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.taskListRef }, res);
    }

    /**
     * @swagger
     * /v1/list:
     *   post:
     *     summary: Cadastra uma lista de atividaes
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               name: 'LISTA 1'
     *               dateStart: '10/10/2000'
     *               dateEnd: '10/11/2000'
     *               member: 1
     *               tasks: [{task: 1, value: 30.00}, {task: 2, value: 100.00}]
     *             required:
     *               - name
     *               - dateStart
     *               - dateEnd
     *               - member
     *               - tasks
     *             properties:
     *               name:
     *                 type: string
     *               dateStart:
     *                 type: date
     *               dateEnd:
     *                 type: date
     *               member:
     *                 type: integer
     *               tasks:
     *                 type: array
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @Middlewares(TaskListValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const { name, dateStart, dateEnd, member, tasks } = req.body;

        // criar a lista de atividades
        const newTaskList: TaskList = new TaskList();
        newTaskList.name = name;
        newTaskList.dateStart = dateStart;
        newTaskList.dateEnd = dateEnd;
        newTaskList.member = member;

        // popular o campo de tarefas
        newTaskList.tasks = tasks.map((task: any) => {
            const newChildTask: ChildTask = new ChildTask();
            newChildTask.content = task.task;
            newChildTask.value = task.value;
            newChildTask.childTaskList = newTaskList;

            return newChildTask;
        });

        await new TaskListRepository().save(newTaskList);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/list/{listId}:
     *   delete:
     *     summary: Apaga uma lista
     *     tags: [Lists]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: listId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Delete('/:id')
    @Middlewares(TaskListValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new TaskListRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
