import { registerDecorator, ValidationOptions } from 'class-validator';

//Here you add the email domains to include as valid users
const ALLOWED_DOMAINS = [
  '@alunos.newtonpaiva.edu.br',
  '@professores.newtonpaiva.edu.br',
] as const;

export function IsNewtonPaivaEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsNewtonPaivaEmail',
      target: object.constructor,
      propertyName,
      options: {
        message:
          'The email must belong to the domains alunos.newtonpaiva.edu.br or professores.newtonpaiva.edu.br.',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          const v = value.trim().toLowerCase();
          return ALLOWED_DOMAINS.some((d) => v.endsWith(d));
        },
      },
    });
  };
}
