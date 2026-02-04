# agent.me

Create your AI twin - a personalized AI agent based on your personality, work style, and communication patterns.

## Features

- **ChatGPT History Analysis**: Upload your ChatGPT export to analyze your conversation patterns, interests, and communication style
- **Smart Questionnaire**: Answer thoughtful questions about your work style and preferences
- **OAuth Integration**: Connect Google or GitHub to enrich your profile
- **AI Profile Generation**: Get a detailed personality profile and ready-to-use system prompt

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agent.me.git
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

4. Fill in your OAuth credentials in `.env`:
- Create a Google OAuth app at [Google Cloud Console](https://console.cloud.google.com/)
- Create a GitHub OAuth app at [GitHub Developer Settings](https://github.com/settings/developers)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Export ChatGPT Data

1. Go to [chat.openai.com](https://chat.openai.com) and sign in
2. Click your profile picture → Settings
3. Navigate to "Data Controls"
4. Click "Export data" and confirm
5. Wait for the email with your download link
6. Extract the ZIP and upload `conversations.json`

## Privacy

Your privacy is important to us:
- All chat analysis happens in your browser
- We don't store or transmit your conversations
- OAuth is optional and only used for additional profile enrichment

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## License

MIT
