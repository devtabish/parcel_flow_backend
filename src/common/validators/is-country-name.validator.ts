import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCountryName(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'IsCountryName',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: string): boolean {
                    return typeof value === 'string' && COUNTRY_NAMES.has(value);
                },
                defaultMessage(): string {
                    return 'Invalid country name';
                },
            },
        });
    };
}

const COUNTRY_NAMES: Set<string> = new Set(['India', 'United Arab Emirates', 'United States']);
