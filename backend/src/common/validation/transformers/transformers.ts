import { Transform } from 'class-transformer';

type TransformInput = { value: any };

export const Trim = () =>
  Transform(({ value }: TransformInput) =>
    typeof value === 'string' ? value.trim() : value,
  );

export const ToLowerCase = () =>
  Transform(({ value }: TransformInput) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  );

export const OnlyNumbers = () =>
  Transform(({ value }: TransformInput) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value,
  );
