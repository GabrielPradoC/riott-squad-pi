// Modules
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Middlewares, Post, PublicRoute } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

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
     *               password: password123
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     // *       $ref: '#/components/responses/baseResponse'
     */
    @Post()
    @PublicRoute()
    @Middlewares(UserValidator.login())
    public async login(req: Request, res: Response): Promise<void> {
        const hash: string = req.body.userRef.passwordHash;
        const check: boolean = await bcrypt.compare(req.body.password, hash);
        // TODO: criar uma token com o id do user.
        RouteResponse.success(check, res);
    }
}
