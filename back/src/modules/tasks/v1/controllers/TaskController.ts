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
import { Task } from '../../../../library/database/entity';

// Repositories
import { TaskRepository } from '../../../../library/database/repository';

// Validators
import { TaskValidator } from '../middlewares/TaskValidator';

// Middlewares
import { authMiddleware } from '../../../authentication/v1';

@Controller(EnumEndpoints.TASK_V1)
export class TaskController extends BaseController {
    /**
     * @swagger
     * /v1/task:
     *   get:
     *     summary: Lista todas as tarefas
     *     description: Esse endpoint lista todas as terefas cadastradas. Tarefas que pertencem a uma ***lista de tarefas*** são manipuladas no endpoint *list*
     *     tags: [Tasks]
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
        const [rows, count] = await new TaskRepository().list<Task>(TaskController.listParams(req));
        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     * /v1/task/{taskId}:
     *   get:
     *     summary: Retorna informações de uma tarefa
     *     description: Esse endpoint se refere a tarefas cadastradas. Tarefas que pertencem a uma ***lista de tarefas*** são manipuladas no endpoint *list*
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: taskId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/:id')
    @Middlewares(TaskValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.TaskRef }, res);
    }

    /**
     * @swagger
     * /v1/task:
     *   post:
     *     summary: cadastra uma tarefa
     *     description: Esse endpoint se refere a tarefas cadastradas. Tarefas que pertencem a uma ***lista de tarefas*** são manipuladas no endpoint *list*
     *     tags: [Tasks]
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
     *               description: 'varrer a casa'
     *               parent: 1
     *             required:
     *               - description
     *               - photo
     *             properties:
     *               description:
     *                 type: string
     *               parent:
     *                 type: number
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @Middlewares(TaskValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const { description, parent } = req.body;

        const newTask: DeepPartial<Task> = {
            description,
            parent
        };

        await new TaskRepository().insert(newTask);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/task/{taskId}:
     *   put:
     *     summary: Altera uma tarefa
     *     description: Esse endpoint se refere a tarefas cadastradas. Tarefas que pertencem a uma ***lista de tarefas*** são manipuladas no endpoint *list*
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: memberId
     *         schema:
     *           type: string
     *         required: true
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               description: nova descrição
     *               parent: 1
     *             required:
     *               - description
     *               - parent
     *             properties:
     *               description:
     *                 type: string
     *               parent:
     *                 type: int
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put('/:id')
    @Middlewares(TaskValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const task: Task = req.body.taskRef;

        task.description = req.body.description;

        await new TaskRepository().update(task);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/task/{taskId}:
     *   delete:
     *     summary: Apaga uma tarefa
     *     description: Esse endpoint se refere a tarefas cadastradas. Tarefas que pertencem a uma ***lista de tarefas*** são manipuladas no endpoint *list*
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: taskId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Delete('/:id')
    @Middlewares(TaskValidator.onlyId(), authMiddleware())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new TaskRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
