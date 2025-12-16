
import { motia } from '../lib/motia'; // Using local mock for demo
import { InfrastructureManager } from '../services/mock_infrastructure';
import { AiOpsAgent } from '../utils/ai_agent';

/**
 * Workflow: Incident Response
 * 
 * This workflow orchestrates the entire lifecycle of a production incident:
 * Detection -> Analysis -> Proposal -> Approval -> Remediation -> Verification.
 */
export const incidentResponseWorkflow = motia.workflow("incident-response-v1", async (event: { alertId: string, severity: string }) => {

    console.log(`\n🚀 WORKFLOW STARTED: Handling Incident ${event.alertId}`);

    // --- STEP 1: GATHER CONTEXT ---
    // Durable step: If this fails (e.g., API down), Motia retries it automatically.
    const logs = await motia.step("fetch-system-logs", async () => {
        console.log("... Fetching recent system logs");
        return await InfrastructureManager.getSystemLogs();
    });

    // --- STEP 2: AI ANALYSIS ---
    const analysis = await motia.step("ai-analysis", async () => {
        console.log("... Sending logs to AI Agent for analysis");
        return await AiOpsAgent.analyzeIncident(logs);
    });

    console.log(`\n🔎 FINDINGS:
     - Root Cause: ${analysis.rootCause}
     - Proposed Fix: ${analysis.recommendedAction}
     - Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);

    // --- STEP 3: HUMAN APPROVAL (The Hackathon Winner Feature) ---
    // This step pauses execution until an external event is received.
    // It effectively puts the workflow to "sleep" without consuming compute.
    const approval = await motia.step("wait-for-human-approval", async () => {
        console.log(`\n✋ STOP: Waiting for Admin approval to run: '${analysis.recommendedAction}'`);
        console.log(`   (Send POST to /approve-fix?p=123 to continue)`);

        // In a real Motia app, this waits for a webhook/signal
        return await motia.waitForEvent("approval-received", { timeout: "24h" });
    });

    if (!approval.approved) {
        console.log("❌ Fix Rejected by Admin. Escalating to PagerDuty.");
        return { status: "ESCALATED", reason: "Admin rejected automated fix" };
    }

    // --- STEP 4: EXECUTE REMEDIATION ---
    const executionResult = await motia.step("execute-fix", async () => {
        console.log(`\n🛠️ EXECUTING: Running '${analysis.recommendedAction}'...`);
        return await InfrastructureManager.executeCommand(analysis.recommendedAction);
    });

    // --- STEP 5: VERIFY HEALTH ---
    const finalHealth = await motia.step("verify-health", async () => {
        console.log("... Verifying system health post-fix");
        const health = await InfrastructureManager.healthCheck();
        if (health.status !== 200) {
            throw new Error("System still unhealthy after fix!"); // Motia will catch this and could trigger retry/fallback
        }
        return health;
    });

    console.log("\n✅ INCIDENT RESOLVED: System is healthy.");
    return { status: "RESOLVED", actions: [analysis.recommendedAction], verification: finalHealth };
});
