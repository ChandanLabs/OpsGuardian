
import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';

export const config: ApiRouteConfig = {
    name: 'ApproveFix',
    type: 'api',
    path: '/approval/approve',
    method: 'POST',
    description: 'Admin approves the proposed fix',
    emits: ['incident.approved'],
    responseSchema: {
        200: z.object({
            message: z.string(),
            status: z.string()
        }),
        404: z.object({ error: z.string() })
    }
};

export const handler: any = async (req: any, { emit, logger, state }: any) => {
    const { alertId } = req.body; // Changed from runId to alertId for simplicity in this pattern

    // Verify state
    const currentStatus = await state.get(`incident:${alertId}:status`);

    if (currentStatus !== 'WAITING_APPROVAL') {
        return {
            status: 404, // Using 404 for "not found in correct state"
            body: { error: `Incident ${alertId} is not waiting for approval (Status: ${currentStatus})` }
        };
    }

    const analysis = await state.get(`incident:${alertId}:analysis`);

    logger.info(`✅ Admin Approved fix for ${alertId}`);

    await state.set(`incident:${alertId}:status`, 'APPROVED');

    await emit({
        topic: 'incident.approved',
        data: { alertId, analysis }
    });

    return {
        status: 200,
        body: {
            message: "Remediation approved. Executing fix now.",
            status: "approved"
        }
    };
};
