# AI Powered Health Advisor

A full-stack AI-powered web application for secure blood report upload, analysis, and personalized health recommendations.

---

## Features

- **Secure PDF Upload:** Drag & drop or select your blood report (PDF, max 10MB).
- **AI Analysis:** Uses OpenAI/Azure OpenAI to analyze your report and generate insights.
- **Personalized Recommendations:** Lifestyle, dietary, and health advice.
- **Health Trends & Insights:** Visual trends and AI-driven health tips.
- **Privacy First:** Your data is processed securely and never stored.

---

## Tech Stack

- **Frontend:** React, Framer Motion, Lucide Icons, React Dropzone, React Hot Toast
- **Backend:** Node.js, Express, Azure OpenAI, pdf-parse, Multer
- **Styling:** Custom CSS (orange/creamy white theme)
- **Deployment:** Easily deployable to Render, Railway, Vercel, or Netlify

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AnkAIJourney/AIHealthAdvisor.git
cd AIHealthAdvisor
```

### 2. Setup environment variables

Create a `.env` file in the root directory:

```
OPENAI_API_KEY=your_openai_or_azure_key
AZURE_ENDPOINT=your_azure_openai_endpoint
API_VERSION=2024-02-01
AZURE_DEPLOYMENT=your_azure_deployment_name
```

### 3. Install dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Run locally

**Backend:**
```bash
npm run dev
```

**Frontend (in a new terminal):**
```bash
cd frontend
npm start
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend/API: [http://localhost:5000](http://localhost:5000)

---

## Build for Production

```bash
cd frontend
npm run build
```
The production build will be in `frontend/build`. The backend will serve this automatically.

---

## Deployment

- **Backend:** Deploy to [Render](https://render.com), [Railway](https://railway.app), or similar.
- **Frontend:** Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (or serve via backend).

---

## License

MIT

---

## Disclaimer

This tool is for informational purposes only and should not replace professional medical advice.
