
import dotenv from 'dotenv';
import OpenAI from 'openai'; // Uncomment in production

dotenv.config();

// Initialize OpenAI client only if API key is present
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export class AiOpsAgent {

    /**
     * Analyzes text logs and determines root cause and fix.
     */
    static async analyzeIncident(logs: string): Promise<{ rootCause: string; recommendedAction: string; confidence: number }> {
        console.log("🤖 AI Agent: Analyzing logs...");

        if (openai) {
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [
                        {
                            role: "system",
                            content: "You are an expert SRE (Site Reliability Engineer). Analyze the following log logs and determine the root cause and a recommended action. Return the result in JSON format with keys: rootCause, recommendedAction, and confidence (a number between 0 and 1)."
                        },
                        {
                            role: "user",
                            content: logs
                        }
                    ],
                    temperature: 0.1,
                });

                const content = response.choices[0].message?.content;
                if (content) {
                    // Start of basic JSON parsing handling
                    // Removing potential markdown code block backticks if present
                    const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
                    const parsed = JSON.parse(cleanContent);
                    return {
                        rootCause: parsed.rootCause || "Unknown",
                        recommendedAction: parsed.recommendedAction || "Investigate manually",
                        confidence: parsed.confidence || 0.5
                    };
                }
            } catch (error) {
                console.error("OpenAI API Call Failed, falling back to mock logic:", error);
            }
        }

        // MOCK RESPONSE Logic based on log content (Fallback)
        if (logs.includes("Redis")) {
            return {
                rootCause: "Redis Connection Pool Exhaustion",
                recommendedAction: "restart redis-server --immediate",
                confidence: 0.98
            };
        }

        if (logs.includes("Memory")) {
            return {
                rootCause: "OOM Kill (Out of Memory)",
                recommendedAction: "scale-up instance",
                confidence: 0.85
            };
        }

        return {
            rootCause: "Unknown System Glitch",
            recommendedAction: "reboot system",
            confidence: 0.50
        };
    }
}
