import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCountryCode(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'IsCountryCode',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: string): boolean {
                    return typeof value === 'string' && ISO_COUNTRY_CODES.has(value);
                },
                defaultMessage(): string {
                    return 'Invalid ISO-2 country code (e.g., IN, US, UA)';
                },
            },
        });
    };
}

const ISO_COUNTRY_CODES: Set<string> = new Set(['IN', 'UA', 'US']);
