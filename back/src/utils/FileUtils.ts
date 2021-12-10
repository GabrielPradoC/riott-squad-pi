/**
 * FileUtils
 *
 * Classe de utils para manipulação de arquivos
 */
export class FileUtils {
    /**
     * isPNG.
     *
     * Verifica se o arquivo é um PNG
     *
     * @param buffer - Buffer do arquivo
     * @returns boolean que indica se o arquivo é PNG
     */
    public static isPNG(buffer: Buffer): boolean {
        const PNG_MAGIC_NUMBER: number[] = [0x89, 0x50, 0x4e, 0x47];

        return PNG_MAGIC_NUMBER.every((value, index) => value === buffer[index]);
    }

    /**
     * isjpg
     *
     * Verifica se o arquivo é um JPG
     *
     * @param buffer - Buffer do arquivo
     * @returns boolean que indica se o arquivo é JPG
     */
    public static isJPG(buffer: Buffer): boolean {
        const JPG_MAGIC_NUMBER: number[] = [0xff, 0xd8, 0xff, 0xe0];

        return JPG_MAGIC_NUMBER.every((value, index) => value === buffer[index]);
    }
}
