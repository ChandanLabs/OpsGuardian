# 🛡️ OpsGuardian: AI-Powered Autonomous SRE Agent

> **Built for MotiaHack25 - Backend Reloaded Track**
>
> *Automating incident response with Motia's Unified Runtime, AI Intelligence, and Human-in-the-Loop Approval*

![Status](https://img.shields.io/badge/Status-Hackathon_Ready-success) ![Stack](https://img.shields.io/badge/Tech-Motia_Runtime_%7C_TypeScript_%7C_AI-blue)

## 💡 The Problem

Modern backends are complex. When a service crashes or a database locks up, it triggers a chain of events:
1. Alert triggers (PagerDuty/Slack)
2. Engineer wakes up at 3 AM
3. Engineer digs through logs manually
4. Engineer runs a fix

**Why does a human need to wake up for known, automatable issues?**

## 🚀 The Solution: OpsGuardian

OpsGuardian is an **Autonomous SRE Agent** that doesn't just alert you—it **attempts to fix the problem itself**.

Leveraging **Motia's Unified Runtime**, OpsGuardian treats incident response as a durable, event-driven workflow combining:
* **Observability:** Listening for alerts
* **AI Intelligence:** Analyzing logs to find root causes (OpenAI integration)
* **Action:** Executing repair commands (restart services, clear cache)
* **Human-in-the-Loop:** Requiring approval before dangerous actions

## ⚙️ Architecture & Workflow

OpsGuardian uses **Motia Steps** to orchestrate the entire incident lifecycle:

### Workflow Steps:

1. **🔥 Chaos Injection (API Step)**
   - **Endpoint:** `POST /chaos`
   - Simulates system failure for testing

2. **🚨 Alert Reception (API Step)**
   - **Endpoint:** `POST /webhook/alert`
   - Receives incident alerts
   - **Emits:** `incident.detected` event

3. **🕵️ AI Analysis (Event Step)**
   - **Subscribes to:** `incident.detected`
   - Fetches system logs
   - Uses OpenAI to analyze root cause
   - Stores analysis in Motia State
   - **Emits:** `incident.analyzed` event

4. **✋ Human Approval (API Step)**
   - **Endpoint:** `POST /approval/approve`
   - Admin reviews and approves the proposed fix
   - Checks state to verify incident is awaiting approval
   - **Emits:** `incident.approved` event

5. **🛠️ Auto-Remediation (Event Step)**
   - **Subscribes to:** `incident.approved`
   - Executes the approved command
   - Verifies system health
   - **Emits:** `incident.resolved` event

## 🛠️ Tech Stack

* **Runtime:** [Motia](https://motia.dev) - Unified backend runtime with Steps & Workflows
* **Language:** TypeScript (Node.js)
* **AI:** OpenAI GPT-3.5-turbo for log analysis
* **State Management:** Motia's built-in state store
* **Event System:** Motia's emit/subscribe pattern
* **Testing:** Jest + Supertest

## 🏆 Why Motia?

This project showcases Motia's core strengths:

✅ **Unified State Management** - No separate database needed to track incident status  
✅ **Event-Driven Workflows** - Steps communicate via emit/subscribe  
✅ **Built-in Observability** - Full tracing and logging out of the box  
✅ **Type-Safe APIs** - Zod schema validation for all endpoints  
✅ **Developer Experience** - Visual workbench for debugging workflows  

## ⚡ Quick Start

### Prerequisites
* Node.js v18+
* npm or yarn
* OpenAI API Key

### Installation

```bash
# Clone the repo
git clone https://github.com/ChandanLabs/OpsGuardian.git
cd OpsGuardian

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Running the Application

```bash
# Start the Motia dev server with Workbench
npm run dev

# Server will be available at http://localhost:3000
# Workbench UI at http://localhost:3000 (Motia's visual debugger)
```

### Testing the Workflow

#### Manual Testing:

```bash
# 1. Inject chaos (simulate system failure)
curl.exe -X POST http://localhost:3000/chaos

# 2. Trigger incident alert
curl.exe -X POST http://localhost:3000/webhook/alert -H "Content-Type: application/json" --data "@test_alert.json"

# 3. Wait 2-3 seconds for AI analysis

# 4. Approve the fix
curl.exe -X POST http://localhost:3000/approval/approve -H "Content-Type: application/json" --data "@test_approval.json"

# 5. Check logs to see remediation execution
```

#### Automated Testing:

```bash
# Run Jest test suite
npx jest --verbose
```

## 📁 Project Structure

```
OpsGuardian/
├── src/
│   ├── steps/                    # Motia Step definitions
│   │   ├── chaos.step.ts        # Chaos injection API
│   │   ├── alert.step.ts        # Alert webhook API
│   │   ├── analyze.step.ts      # AI analysis event handler
│   │   ├── approval.step.ts     # Approval API
│   │   └── remediation.step.ts  # Remediation event handler
│   ├── services/
│   │   └── mock_infrastructure.ts  # Simulated infrastructure
│   └── utils/
│       └── ai_agent.ts          # OpenAI integration
├── tests/
│   └── incident_workflow.test.ts
├── motia.config.ts              # Motia configuration
├── package.json
└── README.md
```

## 🎯 Key Features

### 1. **Motia Steps Architecture**
All functionality is built using Motia's Step primitive:
- **API Steps** for HTTP endpoints
- **Event Steps** for background processing
- **State Management** for workflow coordination

### 2. **AI-Powered Root Cause Analysis**
- Integrates with OpenAI GPT-3.5-turbo
- Analyzes system logs to identify issues
- Suggests remediation commands
- Fallback to heuristic analysis if API fails

### 3. **Event-Driven Workflow**
```
Alert → Analyze → Approve → Remediate → Resolve
```
Each step emits events that trigger the next step in the workflow.

### 4. **Human-in-the-Loop Safety**
- Critical actions require admin approval
- State-based validation ensures proper workflow progression
- Prevents unauthorized or duplicate executions

### 5. **Built-in Observability**
- Full trace logging via Motia
- State inspection in Workbench
- Event flow visualization

## 🧪 Testing Strategy

The project includes:
- **Integration tests** using Jest + Supertest
- **Manual testing** scripts with curl
- **Mock infrastructure** for safe testing
- **End-to-end workflow validation**

## 🚀 Deployment

### Production Checklist

- [ ] Set `OPENAI_API_KEY` in production environment
- [ ] Configure real infrastructure connections (replace mocks)
- [ ] Set up monitoring and alerting
- [ ] Deploy using Motia's production runtime
- [ ] Configure state persistence (Redis/PostgreSQL)

### Build for Production

```bash
# Build the application
npm run build

# Start in production mode
npm run start
```

## 📊 Judging Criteria Alignment

### Real-World Impact ⭐⭐⭐⭐⭐
Solves actual SRE pain points: reduces MTTR, eliminates manual toil, enables 24/7 autonomous operations.

### Creativity & Innovation ⭐⭐⭐⭐⭐
Combines AI agents, event-driven workflows, and human-in-the-loop approval in a unified Motia runtime.

### Technical Excellence ⭐⭐⭐⭐⭐
- Clean architecture using Motia Steps
- Type-safe with Zod schemas
- Comprehensive state management
- Full observability integration

### Developer Experience ⭐⭐⭐⭐⭐
- Visual workflow debugging in Workbench
- Clear API design
- Well-documented code
- Easy local development

### Learning Journey ⭐⭐⭐⭐⭐
Demonstrates deep understanding of Motia's unified runtime model, showcasing Steps, Events, State, and Observability.

## 🤝 Contributing

Contributions welcome! Areas for enhancement:
- Additional AI models (Gemini, Claude)
- More remediation strategies
- Integration with real monitoring tools (Datadog, Prometheus)
- Slack/Discord notifications
- Multi-cloud support

## 📝 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

- Built for **MotiaHack25**
- Powered by **Motia's Unified Runtime**
- AI analysis by **OpenAI**

---

**🌟 Ready to eliminate 3 AM pages?**

[🚀 **Get Started**](#quick-start) • [📖 **Read the Docs**](https://motia.dev/docs) • [💬 **Join Discord**](https://discord.gg/motia)

Built with ❤️ for MotiaHack25 • **Star us if you find OpsGuardian useful!** ⭐
