import { BadRequestException } from '@nestjs/common';

/**
 * Função utilitária para tratar erros de banco e lançar exceções apropriadas
 * @param error - erro capturado no try/catch
 * @param message - mensagem customizada para o usuário
 */
export function handleDatabaseError(error: unknown, message: string): never {
  if (error instanceof Error && 'detail' in error && 'code' in error) {
    const typedError = error as Error & { detail?: string; code?: string };
    throw new BadRequestException({
      message: message,
      detail: typedError.detail ?? typedError.message,
      code: typedError.code ?? 'UNKNOWN_ERROR',
    });
  } else if (error instanceof Error) {
    throw new BadRequestException({
      message: message,
      detail: error.message,
      code: 'UNKNOWN_ERROR',
    });
  } else {
    throw new BadRequestException({
      message: message,
      detail: 'UNKNOWN_ERROR',
      code: 'UNKNOWN_ERROR',
    });
  }
}
