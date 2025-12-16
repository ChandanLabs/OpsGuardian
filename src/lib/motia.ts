
/**
 * MOCK MOTIA SDK for Local Testing
 * This simulates the behavior of the Motia Runtime.
 */

import { v4 as uuidv4 } from 'uuid';

export const motia = {
    // Mock 'step' - just executes the function immediately but logs it
    step: async (name: string, fn: () => Promise<any>) => {
        console.log(`\n[Motia Runtime] ▶️  Running Step: "${name}"`);
        try {
            const result = await fn();
            console.log(`[Motia Runtime] ✔️  Step "${name}" Complete.`);
            return result;
        } catch (e) {
            console.error(`[Motia Runtime] ❌ Step "${name}" Failed.`);
            throw e;
        }
    },

    // Mock 'workflow' - returns a wrapper that can be triggered
    workflow: (name: string, fn: (event: any) => Promise<any>) => {
        return {
            trigger: async (event: any) => {
                const runId = uuidv4();
                console.log(`[Motia Runtime] 🟢 Initializing Workflow "${name}" (RunID: ${runId})`);

                // Run async without awaiting to simulate background job
                fn(event).catch(err => console.error("Workflow Runtime Error:", err));

                return runId;
            }
        };
    },

    // Mock 'waitForEvent' - this needs to actually pause. 
    // For a simple mock, we can use a global event emitter pattern.
    waitForEvent: async (eventName: string, options: any) => {
        console.log(`[Motia Runtime] ⏸️  Workflow Suspended. Waiting for event: "${eventName}"...`);

        return new Promise((resolve) => {
            // Allow internal mechanism to resolve this promise later
            // In a real app, this is handled by the database state machine.
            // We will attach this resolver to a global map to be called by sendEvent.
            (global as any)._motia_event_listeners = (global as any)._motia_event_listeners || {};
            (global as any)._motia_event_listeners[eventName] = resolve;
        });
    },

    // Mock 'sendEvent' - triggers the waiting promise
    sendEvent: async (runId: string, eventName: string, payload: any) => {
        console.log(`[Motia Runtime] ⚡ Event Received: "${eventName}"`);
        const resolver = (global as any)._motia_event_listeners?.[eventName];
        if (resolver) {
            resolver(payload);
            delete (global as any)._motia_event_listeners[eventName];
            console.log(`[Motia Runtime] ▶️  Resuming workflow...`);
        } else {
            console.warn(`[Motia Runtime] ⚠️  No active listeners for verification of event "${eventName}"`);
        }
    }
};
