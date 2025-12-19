
import request from 'supertest';
import express from 'express';
import { incidentResponseWorkflow } from '../src/workflows/incident_response';

// Mock the real Motia if we haven't switched yet, 
// OR simpler: Integration test the Express endpoints.
// We'll mock the express app for now since we don't have the full app exported.

const BASE_URL = 'http://localhost:3000';

describe('OpsGuardian End-to-End Flow', () => {
    it('should handle the full incident lifecycle', async () => {
        // 1. Simulate Chaos
        const chaosRes = await request(BASE_URL).post('/chaos');
        expect(chaosRes.status).toBe(200);
        expect(chaosRes.body.message).toContain('CHAOS INJECTED');

        // 2. Trigger Incident
        const alertPayload = { alertId: "TEST-ERR-001", severity: "CRITICAL" };
        const webhookRes = await request(BASE_URL).post('/webhook/alert').send(alertPayload);
        expect(webhookRes.status).toBe(200);
        expect(webhookRes.body.alertId).toBeDefined();

        // Wait for AI analysis (simulation)
        await new Promise(r => setTimeout(r, 2000));

        // 3. Approve Fix
        const approvalRes = await request(BASE_URL).post('/approval/approve').send({ alertId: "TEST-ERR-001" });
        expect(approvalRes.status).toBe(200);
        expect(approvalRes.body.message).toContain('Remediation approved');
    }, 20000); // Long timeout for workflow
});
