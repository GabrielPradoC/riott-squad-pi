// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

// Constants
import { EnumConstants } from '../../../../models/EnumConstants';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Delete, Get, Middlewares, Post, PublicRoute, Put } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { User } from '../../../../library/database/entity';

// Repositories
import { UserRepository } from '../../../../library/database/repository';

// Validators
import { UserValidator } from '../middlewares/UserValidator';

@Controller(EnumEndpoints.USER_V1)
export class UserController extends BaseController {
    /**
     * @swagger
     * /v1/user:
     *   get:
     *     summary: Lista os usuários
     *     tags: [Users]
     *     security:
     *       - BearerAuth: []
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
        const [rows, count] = await new UserRepository().list<User>(UserController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     * /v1/user/{userId}:
     *   get:
     *     summary: Retorna informações de um usuário
     *     tags: [Users]
     *     security:
     *       - BearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/:id')
    @Middlewares(UserValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.userRef }, res);
    }

    /**
     * @swagger
     * /v1/user/{userId}/members:
     *   get:
     *     summary: Retorna todos os membros pertencentes a um usuário
     *     tags: [Users, Members]
     *     security:
     *       - BearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/:id/members')
    @Middlewares(UserValidator.onlyId())
    public async getChildren(req: Request, res: Response): Promise<void> {
        const { children } = req.body.userRef;
        RouteResponse.success({ children }, res);
    }

    /**
     * @swagger
     * /v1/user/{userId}/tasks:
     *   get:
     *     summary: Retorna todas as tarefas pertencentes a um usuário
     *     tags: [Users, Tasks]
     *     security:
     *       - BearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/:id/tasks')
    @Middlewares(UserValidator.onlyId())
    public async getTasks(req: Request, res: Response): Promise<void> {
        const { createdTasks } = req.body.userRef;
        RouteResponse.success({ createdTasks }, res);
    }

    /**
     * @swagger
     * /v1/user:
     *   put:
     *     summary: Altera um usuário
     *     tags: [Users]
     *     security:
     *       - BearerAuth: []
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
     *               id: userId
     *               name: userName
     *             required:
     *               - id
     *               - name
     *             properties:
     *               id:
     *                 type: string
     *               name:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @Middlewares(UserValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const user: User = req.body.userRef;

        user.name = req.body.name;

        await new UserRepository().update(user);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/{userId}:
     *   delete:
     *     summary: Apaga um usuário definitivamente
     *     tags: [Users]
     *     security:
     *       - BearerAuth: []
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Delete('/:id')
    @Middlewares(UserValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new UserRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
