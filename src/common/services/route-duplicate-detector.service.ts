import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModulesContainer, MetadataScanner, Reflector } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common';

@Injectable()
export class RouteDuplicateDetector implements OnModuleInit {
    constructor(
        private readonly modulesContainer: ModulesContainer,
        private readonly metadataScanner: MetadataScanner,
        private readonly reflector: Reflector,
    ) {}

    onModuleInit(): void {
        const routeMap = new Map<string, string[]>();

        for (const module of [...this.modulesContainer.values()]) {
            for (const controller of module.controllers.values()) {
                const controllerPath = this.reflector.get(PATH_METADATA, controller.metatype) || '';

                const prototype = controller.metatype.prototype;

                this.metadataScanner.scanFromPrototype(controller.instance, prototype, (methodName: string) => {
                    const handler = prototype[methodName];

                    const routePath = this.reflector.get(PATH_METADATA, handler) || '';
                    const methodEnum = this.reflector.get(METHOD_METADATA, handler);

                    if (methodEnum === undefined || methodEnum === null) return;

                    const methodNameStr = RequestMethod[methodEnum]; // "GET"

                    const fullPath = `${methodNameStr} /${controllerPath}/${routePath}`.replace(/\/+/g, '/').trim();

                    const handlers = routeMap.get(fullPath) || [];
                    handlers.push(`${controller.metatype.name}.${methodName}()`);
                    routeMap.set(fullPath, handlers);
                });
            }
        }

        const duplicates = [...routeMap.entries()].filter(([, handlers]) => handlers.length > 1);

        if (duplicates.length) {
            console.error('\n❌ DUPLICATE ROUTES DETECTED:\n');
            for (const [route, handlers] of duplicates) {
                console.error(`Route: ${route}`);
                handlers.forEach((h) => console.error(`  → ${h}`));
                console.error('');
            }
            throw new Error('Duplicate route definitions detected.');
        } else console.log('✅ No duplicate routes detected.');
    }
}
