# OpsGuardian - Quick Demo Script

## 🎬 5-Minute Demo Flow

### Setup (30 seconds)
```bash
# Ensure server is running
npm run dev
# Open Workbench at http://localhost:3000
```

### Demo Steps

#### 1. Inject Chaos (30 seconds)
```bash
curl.exe -X POST http://localhost:3000/chaos
```
**Expected Response:**
```json
{"message":"🔥🔥🔥 CHAOS INJECTED! System is now critical."}
```

**Show in Workbench:**
- Chaos step execution trace
- Logs showing system failure simulation

#### 2. Trigger Incident Alert (1 minute)
```bash
curl.exe -X POST http://localhost:3000/webhook/alert -H "Content-Type: application/json" --data "@test_alert.json"
```
**Expected Response:**
```json
{
  "message": "Alert received. Incident response initiated.",
  "alertId": "TEST-001",
  "status": "processing"
}
```

**Show in Workbench:**
- Alert webhook step execution
- Event emission: `incident.detected`
- Analyze step triggered automatically
- AI analysis in progress

#### 3. Watch AI Analysis (1 minute)
**Point out in Workbench:**
- Event step "AnalyzeIncident" running
- Logs showing:
  - System logs fetched
  - OpenAI API call
  - Root cause identified: "Redis Connection Pool Exhaustion"
  - Recommended action: "restart redis-server"
- State updated: `incident:TEST-001:status = WAITING_APPROVAL`
- Event emitted: `incident.analyzed`

#### 4. Human Approval (1 minute)
```bash
curl.exe -X POST http://localhost:3000/approval/approve -H "Content-Type: application/json" --data "@test_approval.json"
```
**Expected Response:**
```json
{
  "message": "Remediation approved. Executing fix now.",
  "status": "approved"
}
```

**Show in Workbench:**
- Approval step execution
- State validation check
- Event emission: `incident.approved`
- Remediation step triggered

#### 5. Auto-Remediation (1 minute)
**Point out in Workbench:**
- Event step "ExecuteRemediation" running
- Logs showing:
  - Command execution: `restart redis-server`
  - Health check performed
  - System verified healthy
- State updated: `incident:TEST-001:status = RESOLVED`
- Event emitted: `incident.resolved`

#### 6. Highlight Motia Features (30 seconds)
**In Workbench, show:**
- **Flow Visualization**: Complete incident response flow
- **State Inspector**: All incident states
- **Traces**: End-to-end execution timeline
- **Logs**: Structured, searchable logs
- **Events**: All emit/subscribe connections

## 🎯 Key Talking Points

### 1. Motia's Unified Runtime
"Instead of juggling separate services for APIs, background jobs, and workflows, everything runs in one unified Motia runtime."

### 2. Steps as the Core Primitive
"All functionality is built using Motia Steps - 3 API steps for endpoints, 2 Event steps for background processing."

### 3. Event-Driven Architecture
"Steps communicate via emit/subscribe. When an alert arrives, it emits an event that triggers AI analysis, which emits another event for approval, and so on."

### 4. Built-in State Management
"No external database needed. Motia's state store tracks incident status, AI analysis results, and workflow progression."

### 5. Observability Out of the Box
"Full tracing, logging, and visualization without any configuration. The Workbench shows exactly what's happening in real-time."

### 6. Real-World Impact
"This solves a real SRE problem: automating incident response for known issues, reducing MTTR from minutes to seconds, and eliminating 3 AM pages."

## 📊 Metrics to Highlight

- **5 Motia Steps** (3 API + 2 Event)
- **4 Event Topics** (incident.detected, analyzed, approved, resolved)
- **3 State Keys** per incident (analysis, status, metadata)
- **100% Event-Driven** workflow
- **Zero External Dependencies** for core workflow (just Motia + OpenAI)

## 🏆 Closing Statement

"OpsGuardian demonstrates the power of Motia's unified runtime by combining APIs, background jobs, AI agents, state management, and observability into a single, cohesive system that solves real production problems. It's not just a demo—it's a production-ready autonomous SRE agent."

---

**Demo Duration:** 5 minutes  
**Wow Factor:** High  
**Motia Integration:** Deep  
**Ready to Win:** ✅
