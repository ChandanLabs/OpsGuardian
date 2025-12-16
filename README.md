# 🛡️ OpsGuardian: The Self-Healing AI SRE

> **Built for Backend Reloaded (MotiaHack25)**
>
> *Automating the "3 AM On-Call" nightmare with Motia's Unified Runtime.*

![Status](https://img.shields.io/badge/Status-Hackathon_MVP-success) ![Stack](https://img.shields.io/badge/Tech-Motia_Runtime_%7C_Node.js_%7C_AI-blue)

## 💡 The Problem
Modern backends are complex. When a service crashes or a database locks up, it usually triggers a frantic chain of events:
1.  Alert triggers (PagerDuty/Slack).
2.  Engineer wakes up.
3.  Engineer digs through logs manually.
4.  Engineer runs a fix.

**Why does a human need to wake up for known issues?**

## 🚀 The Solution: OpsGuardian
OpsGuardian is an **Autonomous SRE Agent** orchestrator. It doesn't just alert you; it attempts to **fix the problem** itself.

Leveraging **Motia's Unified Runtime**, OpsGuardian treats incident response as a durable, stateful workflow. It combines:
* **Observability:** Listening for alerts.
* **AI Intelligence:** Analyzing logs to find root causes.
* **Action:** Executing repair commands (restart services, clear cache).
* **Human-in-the-Loop:** Pausing for approval before dangerous actions.

## ⚙️ Architecture & Flow

OpsGuardian uses **Motia Steps** to orchestrate the entire lifecycle of an incident:

1.  **🚨 Trigger (The Event):**
    * Receives a webhook (e.g., "High Latency" or "Service Crash").
2.  **🕵️ Step 1: Detective (Analysis):**
    * Fetches recent logs and passes them to an AI Agent.
    * *Agent Output:* "It looks like the Redis Cache is full."
3.  **🧠 Step 2: Strategist (Decision):**
    * Determines the fix: `FLUSHALL` or `Restart Redis`.
4.  **✋ Step 3: Gatekeeper (Human Interaction):**
    * **Crucial Motia Feature:** The workflow *pauses* execution and sends an approval link to the Admin.
    * It waits indefinitely for the signal without consuming resources.
5.  **🛠️ Step 4: Mechanic (Execution):**
    * Once approved, Motia executes the fix command reliably.
6.  **✅ Step 5: QA (Verification):**
    * Pings the service health endpoint to ensure the fix worked.

## 🛠️ Tech Stack

* **Runtime:** [Motia](https://motia.dev) (Orchestration, State Management, Durable Execution)
* **Backend:** Node.js / TypeScript
* **AI Intelligence:** Gemini Pro / OpenAI (via API)
* **Infrastructure:** Docker (for simulation)

## 🏆 Why Motia?
This project wouldn't be possible (or would be a nightmare to build) without Motia.
* **Unified State:** We don't need a separate database to track if an incident is "Open" or "Resolved." Motia handles the state.
* **Durable Execution:** If the "Fix" step fails (e.g., network timeout), Motia automatically retries it. We don't write retry logic.
* **Long-Running Workflows:** The "Human Approval" step could take 5 minutes or 5 hours. Motia pauses the function natively.

## ⚡ Quick Start

### Prerequisites
* Node.js v18+
* Motia CLI installed
* `MOTIA_API_KEY` and `AI_API_KEY` in `.env`

### Installation

```bash
# Clone the repo
git clone [https://github.com/yourusername/OpsGuardian.git](https://github.com/yourusername/OpsGuardian.git)

# Install dependencies
npm install

# Start the Motia Worker
npm run dev
