import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function IsInternationalPhoneNumber(defaultCountry?: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            name: 'IsInternationalPhoneNumber',
            target: object.constructor,
            propertyName,
            constraints: [defaultCountry],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments): boolean {
                    if (!value || typeof value !== 'string') return false;

                    const [country] = args.constraints;
                    const phone = parsePhoneNumberFromString(value, country);

                    return !!phone && phone.isValid();
                },

                defaultMessage(): string {
                    return 'Phone number must be a valid international phone number';
                },
            },
        });
    };
}
