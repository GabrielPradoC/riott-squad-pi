import passport from 'passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Request, Response, NextFunction, RequestHandler } from 'express';

import { jwtSession, jwtSecret } from '../../../../config/auth';

// Repositories
import { UserRepository } from '../../../../library/database/repository/UserRepository';

// Entities
import { User } from '../../../../library/database/entity/User';

// Routes
import { RouteResponse } from '../../../../routes';

/**
 * Configuração da estrtégia de autenticação.
 *
 *
 * @summary a função desse middleware é disponiblizar uma referencia a entidade do usuario no request,
 * se o usuario existir no banco de dados, ele vai poder ser acessado por req.user no controller
 *
 * @param decodedToken - O jwt decodificado.
 */
passport.use(
    new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
            passReqToCallback: true
        },
        async (_req: Request, decodedToken: any, done: VerifiedCallback) => {
            const userRepository: UserRepository = new UserRepository();
            const user: User | undefined = await userRepository.findOne(decodedToken.id);
            if (user) {
                done(null, user);
            } else {
                done(null, false, { error: 'usuário não encontrado' });
            }
        }
    )
);

/**
 * authMiddleware.
 *
 * Retorna o middleware de autenticação
 *
 * @remarks o callback da função (passport.authenticate) precisa de uma closure para acessar o request.
 * então essa função encapsula o middleware (passport.authenticate) em outro middleware.
 * esse callback é usado para enviar uma resposta padronizada, ao invês da resposta padrão do passport.
 *
 * @see https://github.com/mikenicholson/passport-jwt/issues/157#issuecomment-502713019
 *
 * @returns o middleware de autenticação.
 */
export const authMiddleware = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('jwt', jwtSession, (err: Error, user: User | false) => {
            if (err) {
                return next(err);
            }
            if (user) {
                req.user = user;
                return next();
            }
            return RouteResponse.unauthorizedError(res, 'Usuário não autorizado');
        })(req, res, next);
    };
};
