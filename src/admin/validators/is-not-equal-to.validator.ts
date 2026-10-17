import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsNotEqualTo', async: false })
export class IsNotEqualToConstraint implements ValidatorConstraintInterface {
    validate(value: unknown, args: ValidationArguments): boolean {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];
        return value !== relatedValue;
    }

    defaultMessage(args: ValidationArguments): string {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} must not be equal to ${relatedPropertyName}`;
    }
}

export function IsNotEqualTo(property: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: IsNotEqualToConstraint,
        });
    };
}
