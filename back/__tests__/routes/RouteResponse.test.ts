// Modules
import { getMockReq, getMockRes } from '@jest-mock/express';

// Routes
import { RouteResponse } from '../../src/routes/RouteResponse';

describe('Testa classe RouterResponse', () => {
    test('Status de sucesso', () => {
        const { res } = getMockRes();

        RouteResponse.success('teste', res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: true,
                data: 'teste'
            })
        );
    });

    test('Status de sucesso ao criar', () => {
        const { res } = getMockRes();

        RouteResponse.successCreate(res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('Status de sucesso vazio', () => {
        const { res } = getMockRes();

        RouteResponse.successEmpty(res);

        expect(res.status).toHaveBeenCalledWith(204);
    });

    test('Status de erro', () => {
        const { res } = getMockRes();

        RouteResponse.error('erro teste', res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: false,
                error: 'erro teste'
            })
        );
    });

    test('Status de erro interno no servidor', () => {
        const { res } = getMockRes();
        const req = getMockReq();

        RouteResponse.serverError(new Error('erro interno'), req, res, (_value: any) => console.log('NextFunction call'));

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: false,
                error: 'erro interno'
            })
        );
    });

    test('Page not found', () => {
        const { res } = getMockRes();
        const req = getMockReq();

        RouteResponse.notFound(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: false,
                error: 'Not Found'
            })
        );
    });

    test('Acesso não autorizado', () => {
        const { res } = getMockRes();

        RouteResponse.unauthorizedError(res, 'Não autorizado');

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: false,
                error: 'Não autorizado'
            })
        );
    });
});
