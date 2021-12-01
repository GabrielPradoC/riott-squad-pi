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
     *     summary: Retorna informações de um membro
     *     tags: [Tasks]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: taksId
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
     *     summary: Cadastra um membro
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
     *               name: 'varrer a casa'
     *               allowance: 100.00
     *               birthday: '10/10/2000'
     *               parent: 1
     *               photo: 'photo.jpg'
     *             required:
     *               - name
     *               - allowance
     *               - birthday
     *               - parent
     *               - photo
     *             properties:
     *               name:
     *                 type: string
     *               parent:
     *                 type: number
     *               birthday:
     *                 type: date
     *               allowance:
     *                 type: float
     *               photo:
     *                 type: file
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
     *     summary: Altera um membro
     *     tags: [Tasks]
     *     consumes:
     *       - multipart/form-data
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
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             example:
     *               name: nome do membro
     *               birthday: 2000/01/01
     *               allowance: 100.00
     *               parent: 1
     *             required:
     *               - id
     *               - name
     *               - allowance
     *               - parent
     *             properties:
     *               name:
     *                 type: string
     *               birthday:
     *                 type: string
     *               allowance:
     *                 type: float
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
     *     summary: Apaga um membro definitivamente
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
