import { SetMetadata } from '@nestjs/common';
import { ERoles } from '../enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ERoles[]): MethodDecorator => SetMetadata(ROLES_KEY, roles);
