
import fs from 'fs';
import path from 'path';

const STATE_FILE = path.resolve(process.cwd(), 'infra_state.json');

interface SystemState {
    healthy: boolean;
    activeIncidents: string[];
    cpuUsage: number;
}

const DEFAULT_STATE: SystemState = {
    healthy: true,
    activeIncidents: [],
    cpuUsage: 12
};

function loadState(): SystemState {
    try {
        if (!fs.existsSync(STATE_FILE)) {
            return DEFAULT_STATE;
        }
        return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    } catch (e) {
        return DEFAULT_STATE;
    }
}

function saveState(state: SystemState) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export class InfrastructureManager {

    static async simulateChaos(): Promise<void> {
        console.log("🔥 CHAOS MONKEY: Injecting failure into Redis Connection Pool...");
        const state = loadState();
        state.healthy = false;
        state.activeIncidents.push("REDIS_CONNECTION_TIMEOUT");
        state.cpuUsage = 98;
        saveState(state);
    }

    static async getSystemLogs(): Promise<string> {
        const timestamp = new Date().toISOString();
        const state = loadState();

        if (state.healthy) {
            return `
[${timestamp}] INFO: Server listening on port 3000
[${timestamp}] INFO: Database connection active
[${timestamp}] INFO: Job queue processing normally
      `.trim();
        } else {
            return `
[${timestamp}] ERROR: Connection to Redis timed out after 5000ms
[${timestamp}] FATAL: RedisPoolExhaustedError: No available clients
[${timestamp}] WARN: Retrying connection... failed.
[${timestamp}] ERROR: Critical process failure in PID 8923
      `.trim();
        }
    }

    static async healthCheck(): Promise<{ status: number; message: string }> {
        const state = loadState();
        if (state.healthy) {
            return { status: 200, message: "OK" };
        } else {
            return { status: 500, message: "SERVICE_UNAVAILABLE" };
        }
    }

    static async executeCommand(command: string): Promise<string> {
        console.log(`💻 Executing Command on Remote Host: $ ${command}`);
        const state = loadState();

        await new Promise(resolve => setTimeout(resolve, 2000));

        if (command.includes("restart redis") || command.includes("flushall") || command.includes("reboot")) {
            state.healthy = true;
            state.activeIncidents = [];
            state.cpuUsage = 15;
            saveState(state);
            return "Command executed successfully. Service 'redis-server' restarted. stdout: OK";
        }

        return `Command '${command}' executed. No specific state change detected.`;
    }
}
