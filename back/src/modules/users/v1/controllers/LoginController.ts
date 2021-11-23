// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';

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

@Controller(EnumEndpoints.LOGIN)
export class LoginController extends BaseController {
    /**
     * @swagger
     * /login:
     *   post:
     *     summary: rota de autenticação
     *     tags: [Users]
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
     *               email: email@email.com
     *               password: senha123
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Post()
    @PublicRoute()
    @Middlewares(UserValidator.post())
    public async login(req: Request, res: Response): Promise<void> {
        // TODO: buscar o user pelo req.body.email
        // TODO: hashear e comparar req.body.password com o hash da senha
        // TODO: criar uma token com o id do user.
        RouteResponse.success({ data: 'ainda não implementado' }, res);
    }
}
