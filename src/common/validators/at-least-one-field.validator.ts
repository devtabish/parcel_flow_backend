import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

type ClassConstructor<T = object> = new (...args: unknown[]) => T;

export function AtLeastOneField<T extends object>(
    fields: readonly (keyof T & string)[],
    validationOptions?: ValidationOptions,
): (constructor: ClassConstructor<T>) => void {
    return (constructor: ClassConstructor<T>): void => {
        registerDecorator({
            name: 'AtLeastOneField',
            target: constructor,
            propertyName: undefined,
            options: validationOptions,
            constraints: [fields],
            validator: {
                validate(_: unknown, args: ValidationArguments): boolean {
                    const object = args.object as Partial<Record<string, unknown>>;
                    const [allowedFields] = args.constraints as [readonly string[]];

                    return allowedFields.some((field) => {
                        const value = object[field];
                        return value !== undefined && value !== null && value !== '';
                    });
                },

                defaultMessage(): string {
                    return 'Provide at least one field to update';
                },
            },
        });
    };
}
