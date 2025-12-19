
import express from 'express';
import dotenv from 'dotenv';
import { InfrastructureManager } from './services/mock_infrastructure';
import { incidentResponseWorkflow } from './workflows/incident_response';
import { motia } from './lib/motia';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// --- DASHBOARD ENDPOINTS ---

/**
 * 1. TRIGGER CHAOS: Breaks the simulated server.
 */
app.post('/chaos', async (req, res) => {
    await InfrastructureManager.simulateChaos();
    res.json({ message: "🔥🔥🔥 CHAOS INJECTED! System is now critical." });
});

/**
 * 2. WEBHOOK RECEIVER: The 'Alert Manager' calls this when it detects the crash.
 * This triggers the Motia Workflow.
 */
app.post('/webhook/alert', async (req, res) => {
    const { alertId, severity } = req.body;

    // Trigger the durable workflow
    const runId = await incidentResponseWorkflow.trigger({ alertId, severity });

    res.json({
        message: "Alert received. OpsGuardian activated.",
        workflowRunId: runId
    });
});

/**
 * 3. APPROVAL ENDPOINT: The Human Admin clicks a button to call this.
 */
app.post('/approval/approve', async (req, res) => {
    const { runId } = req.body;

    // Send the signal to the paused workflow to wake it up
    await motia.sendEvent(runId, "approval-received", { approved: true, user: "admin@company.com" });

    res.json({ message: `✅ Signal sent to workflow ${runId}. Remediation resuming.` });
});

// Start Server
app.listen(PORT, () => {
    console.log(`
🛡️  OpsGuardian Server Running on http://localhost:${PORT}

DEMO INSTRUCTIONS:
1. Break the system:     POST /chaos
2. Trigger Incident:     POST /webhook/alert { "alertId": "ERR-505", "severity": "CRITICAL" }
3. Check Console Logs to see the AI diagnosis.
4. Approve the Fix:      POST /approval/approve { "runId": "..." }
  `);
});
