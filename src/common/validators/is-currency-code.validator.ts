import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCurrencyCode(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'isCurrencyCode',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string) {
                    if (typeof value !== 'string') return false;
                    return ISO_CURRENCY_CODES.has(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid ISO 4217 currency code (e.g., USD, EUR, PKR)`;
                },
            },
        });
    };
}

const ISO_CURRENCY_CODES: Set<string> = new Set(['USD', 'EUR', 'INR', 'AED']);
