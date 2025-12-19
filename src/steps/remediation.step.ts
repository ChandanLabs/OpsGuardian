
import type { EventConfig, Handlers } from 'motia';
import { InfrastructureManager } from '../services/mock_infrastructure';

export const config: EventConfig = {
    name: 'ExecuteRemediation',
    type: 'event',
    subscribes: ['incident.approved'],
    description: 'Executes the approved fix and verifies health',
    emits: ['incident.resolved']
};

export const handler: any = async (event: any, { emit, logger, state }: any) => {
    logger.info("RECEIVED REMEDIATION EVENT", JSON.stringify(event));
    const data = event.data || event;
    const { alertId, analysis } = data;
    const command = analysis.recommendedAction;

    logger.info(`🛠️ Executing Remediation: ${command}`);

    // 1. Execute Command
    await InfrastructureManager.executeCommand(command);

    // 2. Verify Health
    const health = await InfrastructureManager.healthCheck();

    if (health.status === 200) {
        logger.info("✅ System Health Verified. Incident Resolved.");
        await state.set(`incident:${alertId}:status`, 'RESOLVED');

        await emit({
            topic: 'incident.resolved',
            data: { alertId, status: 'RESOLVED', health }
        });

    } else {
        logger.error("❌ Fix failed. System still unhealthy.");
        await state.set(`incident:${alertId}:status`, 'FIX_FAILED');
    }
};
