# 🤖 agent.me - Create Your AI Twin

## ✨ What is this?

agent.me is a web application that generates a personalized AI agent based on your unique personality, communication style, and work patterns. Instead of using generic AI assistants, you can create one that actually thinks and responds like you.

## 🤔 Why would you use it?

**The problem:** AI assistants are generic. They don't know how you communicate, what you're an expert in, or how you approach problems. You end up re-explaining context every conversation.

**The solution:** agent.me analyzes how you actually communicate and creates a custom AI persona that mirrors your style. Use it to:

- 📝 **Delegate tasks** to an AI that writes like you
- 👥 **Create a digital twin** for async communication
- 🎓 **Train team members** on how you think and work
- ⚡ **Automate responses** that match your voice

## 🔄 How it works

1. 📤 **Upload your ChatGPT export** - We analyze your conversation history to understand your communication patterns, interests, and expertise
2. 📋 **Or take a questionnaire** - Answer questions about your work style, tools, and preferences
3. 📦 **Get your agent files** - Download AGENT.md, SKILLS.md, and a ready-to-use system prompt
4. 💬 **Chat with your agent** - Test it in real-time before deploying
5. 🚀 **Use anywhere** - Works with ChatGPT Custom Instructions, Claude Projects, or any LLM API

## 🔒 Privacy-first

All analysis happens in the browser. We never store or transmit your conversations.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/graemegeorge/agent.me.git
cd agent.me
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Fill in your OAuth credentials in `.env` (optional):
- Create a Google OAuth app at [Google Cloud Console](https://console.cloud.google.com/)
- Create a GitHub OAuth app at [GitHub Developer Settings](https://github.com/settings/developers)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📤 How to Export ChatGPT Data

1. Go to [chat.openai.com](https://chat.openai.com) and sign in
2. Click your profile picture → Settings
3. Navigate to "Data Controls"
4. Click "Export data" and confirm
5. Wait for the email with your download link
6. Extract the ZIP and upload `conversations.json`

## 📦 Generated Files

| File | Description |
|------|-------------|
| **AGENT.md** | Complete persona profile with personality traits, work style, and usage instructions |
| **SKILLS.md** | Capabilities, expertise areas, and what your agent is best used for |
| **SYSTEM_PROMPT.md** | Ready-to-use prompt for ChatGPT, Claude, or any LLM API |
| **profile.json** | Raw profile data for programmatic use |

## 🛠 Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📄 License

MIT
