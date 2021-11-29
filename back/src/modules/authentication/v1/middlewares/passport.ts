import passport from 'passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { RequestHandler } from 'express';

import { jwtSession, jwtSecret } from '../../../../config/auth';

// Repositories
import { UserRepository } from '../../../../library/database/repository/UserRepository';

// Entities
import { User } from '../../../../library/database/entity/User';

passport.use(
    new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret
        },
        /**
         * estrtégia de autenticação.
         *
         * a função desse middleware é disponiblizar uma referencia a entidade do usuario no request.
         * Se o usuario existir no banco de dados, ele vai poder ser acessado por req.user no controller
         * @param decodedToken - O jwt decodificado.
         */
        async (decodedToken: any, done: VerifiedCallback) => {
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
 * retorna o middleware de autenticação
 *
 * @returns o middleware de autenticação.
 */
export const authMiddleware = (): RequestHandler => {
    return passport.authenticate('jwt', jwtSession);
};
