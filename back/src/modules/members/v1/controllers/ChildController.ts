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
import { Child } from '../../../../library/database/entity';

// Repositories
import { ChildRepository } from '../../../../library/database/repository';

// Validators
import { ChildValidator } from '../middlewares/ChildValidator';

// Middlewares
import { authMiddleware } from '../../../authentication/v1';

@Controller(EnumEndpoints.MEMBER_V1)
export class ChildController extends BaseController {
    /**
     * @swagger
     * /v1/member:
     *   get:
     *     summary: Lista os membros
     *     tags: [Members]
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
        const [rows, count] = await new ChildRepository().list<Child>(ChildController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     * /v1/member/{memberId}:
     *   get:
     *     summary: Retorna informações de um membro
     *     tags: [Members]
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
    @Get('/:id')
    @Middlewares(ChildValidator.onlyId())
    public async getOne(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.childRef }, res);
    }

    /**
     * @swagger
     * /v1/member:
     *   post:
     *     summary: Cadastra um membro
     *     tags: [Members]
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
     *               name: TODO
     *               email: TODO
     *               password: TODO
     *             required:
     *               - name
     *               - email
     *               - password
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @Middlewares(ChildValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const { name, birthday, allowance } = req.body;

        const newChild: DeepPartial<Child> = {
            name,
            birthday,
            allowance,
            parent: req.body.userRef,
            childTaskList: [],
            photo: 'TODO resolver isso'
        };

        await new ChildRepository().insert(newChild);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/member/{memberId}:
     *   put:
     *     summary: Altera um membro
     *     tags: [Members]
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
    @Middlewares(ChildValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const child: Child = req.body.childRef;

        child.name = req.body.name;
        child.birthday = req.body.birthday;
        child.allowance = req.body.allowance;

        await new ChildRepository().update(child);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/member/{memberId}:
     *   delete:
     *     summary: Apaga um membro definitivamente
     *     tags: [Members]
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
    @Middlewares(ChildValidator.onlyId(), authMiddleware())
    public async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        await new ChildRepository().delete(id);

        RouteResponse.success({ id }, res);
    }
}
