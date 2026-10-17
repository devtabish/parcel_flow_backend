import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { createPublicKey } from 'crypto';

type PublicKeyFormat = 'pem' | 'base64' | 'hex';

@ValidatorConstraint({ async: false })
class IsPublicKeyConstraint implements ValidatorConstraintInterface {
    validate(value: unknown, args: ValidationArguments): boolean {
        if (typeof value !== 'string' || value.length === 0) return false;

        const [formats] = args.constraints as [PublicKeyFormat[]];

        return formats.some((format) => {
            try {
                const key = format === 'pem' ? value : Buffer.from(value, format === 'hex' ? 'hex' : 'base64');

                createPublicKey(key);
                return true;
            } catch {
                return false;
            }
        });
    }

    defaultMessage(args: ValidationArguments): string {
        const [formats] = args.constraints as [PublicKeyFormat[]];
        return `publicKey must be a valid public key (${formats.join(', ')})`;
    }
}

export function IsPublicKey(formats: PublicKeyFormat[] = ['pem'], options?: ValidationOptions): PropertyDecorator {
    return (target, propertyKey) => {
        registerDecorator({
            target: target.constructor,
            propertyName: propertyKey.toString(),
            options,
            constraints: [formats],
            validator: IsPublicKeyConstraint,
        });
    };
}
