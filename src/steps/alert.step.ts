
import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';

export const config: ApiRouteConfig = {
    name: 'AlertWebhook',
    type: 'api',
    path: '/webhook/alert',
    method: 'POST',
    description: 'Receives alerts and triggers incident response workflow',
    emits: ['incident.detected'],
    responseSchema: {
        200: z.object({
            message: z.string(),
            alertId: z.string(),
            status: z.string()
        })
    }
};

export const handler: any = async (req: any, { emit, logger }: any) => {
    const { alertId, severity } = req.body;

    logger.info(`🚨 Alert Received: ${alertId} (${severity})`);

    await emit({
        topic: 'incident.detected',
        data: { alertId, severity, timestamp: new Date().toISOString() }
    });

    return {
        status: 200,
        body: {
            message: "Alert received. Incident response initiated.",
            alertId,
            status: "processing"
        }
    };
};
