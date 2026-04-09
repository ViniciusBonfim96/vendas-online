import { applyDecorators } from '@nestjs/common';
import { BaseString } from '@/common/validation/base/string-base.decorator';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { OnlyNumbers } from '@/common/validation/transformers/transformers';
import { registerDecorator } from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

/**
 *  Cria um decorator costomizado para validação do CPF
 */
function IsCPFCustom(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    registerDecorator({
      name: 'isCPF',
      target: target.constructor,
      propertyName: propertyKey as string,
      validator: {
        validate(value: string) {
          if (value === null || value === undefined) return false;
          return cpf.isValid(String(value));
        },
        defaultMessage() {
          return 'CPF inválido';
        },
      },
    });
  };
}

export const EmailField = () =>
  applyDecorators(
    BaseString({ min: 5, max: 255, trim: true, toLowerCase: true }),
    IsEmail({}, { message: 'Email inválido' }),
  );

export const PhoneField = () =>
  applyDecorators(
    IsOptional(),
    BaseString({ min: 10, max: 11, trim: true }),
    OnlyNumbers(),
    Matches(/^\d{10,11}$/, {
      message: 'Telefone deve conter 10 ou 11 dígitos',
    }),
  );

export const CPFField = () =>
  applyDecorators(
    BaseString({ trim: true }),
    OnlyNumbers(),
    Matches(/^\d{11}$/, {
      message: 'CPF deve conter 11 dígitos',
    }),
    IsCPFCustom(),
  );

export const PasswordField = () =>
  applyDecorators(
    BaseString({ min: 8, max: 255 }),
    Matches(/^[A-Z]/, {
      message: 'Senha deve começar com letra maiúscula',
    }),

    Matches(/\d/, {
      message: 'Senha deve conter pelo menos um número',
    }),

    Matches(/[^A-Za-z0-9]/, {
      message: 'Senha deve conter pelo menos um caractere especial',
    }),
  );

export const NameField = () =>
  applyDecorators(
    BaseString({ min: 2, max: 255, trim: true }),

    Matches(/^(?!.*\s{2,}).*$/, {
      message: 'Nome não pode conter espaços duplicados',
    }),
    Matches(/^[A-Za-zÀ-ÿ\s']+$/, { message: 'Nome não pode conter numeros.' }),
  );
