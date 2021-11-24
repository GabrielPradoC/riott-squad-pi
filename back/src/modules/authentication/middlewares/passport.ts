import passport from 'passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';

import { jwtSession, jwtSecret } from '../../../config/auth';

// Repositories
import { UserRepository } from '../../../library/database/repository/UserRepository';

// Entities
import { User } from '../../../library/database/entity/User';

passport.use(
    new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret
        },
        // disponibiliza o usuário no objeto request (req.user)
        async (decodedToken: any, done: VerifiedCallback) => {
            const userRepository: UserRepository = new UserRepository();
            const user: User | undefined = await userRepository.findOne(decodedToken.id);
            if (user) {
                done(null, user);
            } else {
                done('usuário não encontrado');
            }
        }
    )
);

export const authMiddleware = passport.authenticate('jwt', jwtSession);
