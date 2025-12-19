
# 🔑 API Key Setup Guide

You asked what "means" regarding the keys. Here is the simple explanation:

## 1. OpenAI API Key (`OPENAI_API_KEY`)
**Current Status:** REQUIRED 🔴
**Why:** OpsGuardian needs a "brain" to analyze the error logs. We use OpenAI for this.
**How to get it:**
1.  Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2.  Log in or Sign Up.
3.  Click **"Create new secret key"**.
4.  Copy the key (it starts with `sk-...`).
5.  Paste it into your `.env` file.

## 2. Motia API Key (`MOTIA_API_KEY`)
**Current Status:** OPTIONAL / MOCK 🟢
**Why:**
*   **Motia** is a runtime (like Node.js). You don't need a key to run it specifically on your laptop.
*   However, if you deploy to the **Motia Cloud** platform later for the hackathon submission, you will need one.
*   **For now:** We are using a **Mock Mode** I built, so you can leave this as `mock-motia-key`.

## Action Items
1.  Open `.env`.
2.  Replace `sk-placeholder` with your real OpenAI Key.
3.  Save the file.
