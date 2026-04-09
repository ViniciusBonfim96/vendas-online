import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  ToLowerCase,
  Trim,
} from '@/common/validation/transformers/transformers';
import { applyDecorators } from '@nestjs/common';

interface StringOptions {
  min?: number;
  max?: number;
  trim?: boolean;
  toLowerCase?: boolean;
  optional?: boolean;
}

export const BaseString = ({
  min = 1,
  max = 255,
  trim = true,
  toLowerCase = false,
  optional = false,
}: StringOptions = {}) => {
  const decorators = [IsString(), MinLength(min), MaxLength(max)];

  if (!optional) decorators.unshift(IsNotEmpty());
  if (optional) decorators.unshift(IsOptional());
  if (trim) decorators.unshift(Trim());
  if (toLowerCase) decorators.unshift(ToLowerCase());

  return applyDecorators(...decorators);
};
