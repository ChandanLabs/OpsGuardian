
import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { InfrastructureManager } from '../services/mock_infrastructure';

export const config: ApiRouteConfig = {
    name: 'ChaosMonkey',
    type: 'api',
    path: '/chaos',
    method: 'POST',
    description: 'Injects failure into the system for testing',
    emits: [],
    responseSchema: {
        200: z.object({
            message: z.string()
        })
    }
};

export const handler: any = async (req: any, { emit, logger }: any) => {
    logger.warn("🔥 Triggering Chaos Monkey...");
    await InfrastructureManager.simulateChaos();

    return {
        status: 200,
        body: {
            message: "🔥🔥🔥 CHAOS INJECTED! System is now critical."
        }
    };
};
