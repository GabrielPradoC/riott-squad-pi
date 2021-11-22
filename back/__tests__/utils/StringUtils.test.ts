import { StringUtils } from '../../src/utils/StringUtils';

describe('Testa utils de string', () => {
    test('Testa método #firstUpperCase', () => {
        expect(StringUtils.firstUpperCase('teste')).toEqual('Teste');
        expect(StringUtils.firstUpperCase('tEsTe')).toEqual('Teste');
        expect(StringUtils.firstUpperCase('TESTE')).toEqual('Teste');
        expect(StringUtils.firstUpperCase('teste')).not.toEqual('teste');
        expect(StringUtils.firstUpperCase('TEsTe')).not.toEqual('TEsTe');

        expect(StringUtils.firstUpperCase('TESTE composto')).toEqual('Teste Composto');
    });

    test('Testa método #firstLowerCase', () => {
        expect(StringUtils.firstLowerCase('teste')).toEqual('teste');
        expect(StringUtils.firstLowerCase('TEsTe')).toEqual('tEsTe');
        expect(StringUtils.firstLowerCase('TESTE')).toEqual('tESTE');

        expect(StringUtils.firstLowerCase('TESTE Composto')).toEqual('tESTE composto');
    });
});
