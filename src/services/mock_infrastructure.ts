
/**
 * Service: Infrastructure Manager
 * Role: Simulates a real monitoring system (Datadog/Prometheus) and an execution shell (SSH).
 */

interface SystemState {
    healthy: boolean;
    activeIncidents: string[];
    cpuUsage: number;
}

// Global mutable state for simulation
let CURRENT_STATE: SystemState = {
    healthy: true,
    activeIncidents: [],
    cpuUsage: 12
};

export class InfrastructureManager {

    /**
     * Simulates a system crash initiated by chaos engineering or random failure.
     */
    static async simulateChaos(): Promise<void> {
        console.log("🔥 CHAOS MONKEY: Injecting failure into Redis Connection Pool...");
        CURRENT_STATE.healthy = false;
        CURRENT_STATE.activeIncidents.push("REDIS_CONNECTION_TIMEOUT");
        CURRENT_STATE.cpuUsage = 98;
    }

    /**
     * Fetches the last 50 lines of logs.
     * If the system is broken, it injects error logs.
     */
    static async getSystemLogs(): Promise<string> {
        const timestamp = new Date().toISOString();

        if (CURRENT_STATE.healthy) {
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

    /**
     * Checks the health of the system via HTTP ping simulation.
     */
    static async healthCheck(): Promise<{ status: number; message: string }> {
        if (CURRENT_STATE.healthy) {
            return { status: 200, message: "OK" };
        } else {
            return { status: 500, message: "SERVICE_UNAVAILABLE" };
        }
    }

    /**
     * Executes a shell command on the server.
     * @param command The bash command to run
     */
    static async executeCommand(command: string): Promise<string> {
        console.log(`💻 Executing Command on Remote Host: $ ${command}`);

        // Simulate latency of a restart
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (command.includes("restart redis") || command.includes("flushall")) {
            CURRENT_STATE.healthy = true;
            CURRENT_STATE.activeIncidents = [];
            CURRENT_STATE.cpuUsage = 15;
            return "Command executed successfully. Service 'redis-server' restarted. stdout: OK";
        }

        return `Command '${command}' executed. No specific state change detected.`;
    }
}
