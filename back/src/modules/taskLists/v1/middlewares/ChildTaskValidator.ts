// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ChildTaskRepository } from '../../../../library/database/repository/ChildTaskRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

/**
 * ChildTaskValidator
 *
 * Classe de validadores para o endpoint de taskLists
 */
export class ChildTaskValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de TaskLists
     */
    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new ChildTaskRepository()),
            errorMessage: 'Tarefa não encontrada'
        },
        isMissed: { in: 'body', isBoolean: true, errorMessage: 'campo isMissed deve ser um booleano' }
    };

    /**
     * patch
     *
     * @summary retorna basicamente todos os validadores de model, menos o duplicate.
     *
     * @returns Lista de validadores
     */
    public static patch(): RequestHandler[] {
        return ChildTaskValidator.validationList({
            id: ChildTaskValidator.model.id,
            isMissed: ChildTaskValidator.model.isMissed
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: ChildTaskValidator.model.id
        });
    }
}
