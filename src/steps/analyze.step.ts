
import type { EventConfig, Handlers } from 'motia';
import { AiOpsAgent } from '../utils/ai_agent';
import { InfrastructureManager } from '../services/mock_infrastructure';

export const config: EventConfig = {
    name: 'AnalyzeIncident',
    type: 'event',
    subscribes: ['incident.detected'],
    emits: ['incident.analyzed'],
    description: 'Analyzes the incident logs and determines a fix'
};

export const handler: any = async (event: any, { emit, logger, state }: any) => {
    logger.info("RECEIVED EVENT", JSON.stringify(event));
    const data = event.data || event; // Fallback if unwrapped
    const { alertId, severity } = data;

    logger.info(`🕵️ analyzing incident ${alertId}...`);

    // 1. Fetch Logs
    const logs = await InfrastructureManager.getSystemLogs();

    // 2. AI Analysis
    const analysis = await AiOpsAgent.analyzeIncident(logs);

    logger.info("AI Analysis Complete", analysis);

    // 3. Store Analysis in State for the Approval Step
    await state.set(`incident:${alertId}:analysis`, analysis);
    await state.set(`incident:${alertId}:status`, 'WAITING_APPROVAL');

    // 4. Emit event to notify admin
    await emit({
        topic: 'incident.analyzed',
        data: {
            alertId,
            analysis,
            approvalLink: `/approval/approve?alertId=${alertId}`
        }
    });
};
