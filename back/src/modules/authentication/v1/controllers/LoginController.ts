// Modules
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Middlewares, Post, PublicRoute } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Validators
import { UserValidator } from '../../../users/v1/middlewares/UserValidator';

// Configs
import { jwtSecret } from '../../../../config/auth';

@Controller(EnumEndpoints.LOGIN_V1)
export class LoginController extends BaseController {
    /**
     * @swagger
     * /v1/login:
     *   post:
     *     summary: rota de autenticação
     *     tags: [Auth]
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
     *       $ref: '#/components/responses/baseResponse'
     */
    @Post()
    @PublicRoute()
    @Middlewares(UserValidator.login())
    public async login(req: Request, res: Response): Promise<void> {
        const hash: string = req.body.userRef.passwordHash;
        const check: boolean = await bcrypt.compare(req.body.password, hash);

        if (check) {
            const token: string = jwt.sign({ id: req.body.userRef.id }, jwtSecret, { expiresIn: '24h' });
            const userId: number = req.body.userRef.id;

            RouteResponse.success({ token, userId }, res);
        } else {
            RouteResponse.unauthorizedError(res, 'Senha errada');
        }
    }
}
